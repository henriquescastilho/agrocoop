import fetch from 'node-fetch';

interface MapBiomasConfig {
    email?: string;
    password?: string;
}

interface Alert {
    id: number;
    alertCode: number;
    areaHa: number;
    detectedAt: string;
    coordinates?: { lat: number; lng: number };
    biome?: string;
}

export class MapBiomasService {
    private static token: string | null = null;
    private static tokenExpiry: number | null = null;
    private static readonly API_URL = 'https://plataforma.alerta.mapbiomas.org/api/v2/graphql';

    // Simple in-memory cache for alerts to prevent API spam
    // Key: "lat,lng,radius" -> Value: { timestamp, alerts }
    private static cache: Map<string, { timestamp: number, data: any }> = new Map();

    private static getConfig(): MapBiomasConfig {
        return {
            email: process.env.MAPBIOMAS_ALERTA_EMAIL,
            password: process.env.MAPBIOMAS_ALERTA_PASSWORD,
        };
    }

    public static hasCredentials(): boolean {
        const config = this.getConfig();
        return !!(config.email && config.password);
    }

    private static async authenticate(): Promise<string | null> {
        const config = this.getConfig();
        if (!config.email || !config.password) return null;

        // Check if token is valid (add buffer of 5 mins)
        if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry - 300000) {
            return this.token;
        }

        const query = `
            mutation {
                signIn(email: "${config.email}", password: "${config.password}") {
                    token
                }
            }
        `;

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const result = await response.json() as any;
            if (result.errors) {
                console.error('MapBiomas Auth Error:', result.errors);
                return null;
            }

            const token = result.data?.signIn?.token;
            if (token) {
                this.token = token;
                // Assuming 1 hour expiry for safety if not provided, usually JWTs have exp claim
                this.tokenExpiry = Date.now() + 3600 * 1000;
                console.log('MapBiomas Authenticated Successfully');
                return token;
            }
        } catch (error) {
            console.error('MapBiomas Auth Network Error:', error);
        }
        return null;
    }

    public static async getRefinedAlerts(lat: number, lng: number, radiusKm: number = 20): Promise<any> {
        // Cache Check
        const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)},${radiusKm}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60) { // 1 hour cache
            return cached.data;
        }

        if (!this.hasCredentials()) {
            return { status: 'missing_config', alerts: [] };
        }

        const token = await this.authenticate();
        if (!token) {
            return { status: 'auth_failed', alerts: [] };
        }

        // Mocking a spatial query logic via "recent alerts" because the public GraphQL 
        // usually doesn't strictly support "radius from point" directly in a simple query 
        // without complex filters. For MVP, we fetch recent and filter manually or 
        // verify if the API supports spatial filters.
        // Assuming we fetch the latest 50 alerts and check distance (naive approach for MVP 
        // to avoid complex geometry interactions if API docs aren't fully clear on geo-filters).

        // Actually, let's use a simpler query for MVP that lists alerts order by date.
        const query = `
            query {
                alerts(limit: 20, sort: { field: DETECTED_AT, order: DESC }) {
                    id
                    alertCode
                    areaHa
                    detectedAt
                    biomes { name }
                    coordinates { latitude longitude }
                }
            }
        `;

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query }),
            });

            const result = await response.json() as any;
            if (result.errors) {
                return { status: 'error', message: result.errors[0].message };
            }

            let alerts = result.data?.alerts || [];

            // Client-side distance filtering for MVP (Naïve Haversine)
            alerts = alerts.filter((a: any) => {
                const d = this.haversine(lat, lng, a.coordinates?.latitude, a.coordinates?.longitude);
                return d <= radiusKm;
            }).map((a: any) => ({
                id: a.id,
                code: a.alertCode,
                date: a.detectedAt,
                area: a.areaHa,
                biome: a.biomes?.[0]?.name,
                distanceKm: this.haversine(lat, lng, a.coordinates?.latitude, a.coordinates?.longitude).toFixed(1)
            }));

            const responseData = { status: 'ok', source: 'mapbiomas_alerta', alerts };
            this.cache.set(cacheKey, { timestamp: Date.now(), data: responseData });
            return responseData;

        } catch (error) {
            console.error('MapBiomas Fetch Error:', error);
            return { status: 'network_error', alerts: [] };
        }
    }

    private static haversine(lat1: number, lon1: number, lat2?: number, lon2?: number): number {
        if (!lat2 || !lon2) return 99999;
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public static async getRouteContext(originBy: { lat: number, lng: number }, destBy: { lat: number, lng: number }): Promise<any> {
        // Mocked logic leveraging the ambient ambient signals
        // In a real scenario, we'd sample points along the route.
        const midLat = (originBy.lat + destBy.lat) / 2;
        const midLng = (originBy.lng + destBy.lng) / 2;

        // Check "corridor"
        const ambient = await this.getRefinedAlerts(midLat, midLng, 100); // 100km corridor

        return {
            status: ambient.status,
            riskScore: ambient.alerts?.length > 0 ? (ambient.alerts.length > 5 ? 'HIGH' : 'MEDIUM') : 'LOW',
            alertsOnRoute: ambient.alerts || [],
            explanation: ambient.alerts?.length > 0
                ? `Rota cruza região com ${ambient.alerts.length} alertas recentes de desmatamento no bioma ${ambient.alerts[0].biome}.`
                : "Rota livre de alertas ambientais recentes críticos."
        };
    }
}
