import { z } from 'zod';

const EnvironmentalDataSchema = z.object({
    airQuality: z.object({
        aqi: z.number(),
        category: z.string(),
        dominantPollutant: z.string().optional(),
    }).optional(),
    pollen: z.object({
        grass: z.string(),
        tree: z.string(),
        weed: z.string(),
    }).optional(),
    solar: z.object({
        maxSunshineHours: z.number(),
        carbonOffset: z.number(),
    }).optional(),
});

export class GoogleEnvironmentalService {
    private apiKey: string;
    private baseUrl = 'https://airquality.googleapis.com/v1';
    private solarUrl = 'https://solar.googleapis.com/v1';
    private pollenUrl = 'https://pollen.googleapis.com/v1';

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        if (!this.apiKey) {
            console.warn('GoogleEnvironmentalService: GEMINI_API_KEY (used for Google Maps Platform) is missing.');
        }
    }

    async getEnvironmentalData(lat: number, lng: number) {
        if (!this.apiKey) {
            return this.getMockData();
        }

        try {
            const [aqi, pollen] = await Promise.all([
                this.fetchAirQuality(lat, lng),
                this.fetchPollen(lat, lng),
                // Solar API often requires larger areas or specific building data, skipping for simple point query for now or mocking
            ]);

            return {
                airQuality: aqi,
                pollen: pollen,
                solar: this.getMockSolar(), // Mocking solar for now as it's complex to query by point for "potential"
            };
        } catch (error) {
            console.error('GoogleEnvironmentalService Error:', error);
            return this.getMockData();
        }
    }

    private async fetchAirQuality(lat: number, lng: number) {
        const url = `${this.baseUrl}/currentConditions:lookup?key=${this.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: { latitude: lat, longitude: lng } }),
        });

        if (!response.ok) throw new Error(`Air Quality API error: ${response.statusText}`);
        const data = await response.json();

        // Normalize Google response to our schema
        const index = data.indexes?.[0]; // Universal AQI
        return {
            aqi: index?.aqi || 0,
            category: index?.category || 'Unknown',
            dominantPollutant: data.pollutants?.[0]?.displayName || 'None',
        };
    }

    private async fetchPollen(lat: number, lng: number) {
        const url = `${this.pollenUrl}/forecast:lookup?key=${this.apiKey}&location.latitude=${lat}&location.longitude=${lng}&days=1`;
        const response = await fetch(url);

        if (!response.ok) {
            // Pollen API might 403/404 depending on region, fallback safely
            console.warn(`Pollen API error: ${response.statusText}`);
            return this.getMockData().pollen;
        }

        const data = await response.json();
        const day = data.dailyInfo?.[0];
        const types = day?.pollenTypeInfo || [];

        const getLevel = (code: string) => types.find((t: any) => t.code === code)?.indexInfo?.category || 'Low';

        return {
            grass: getLevel('GRASS'),
            tree: getLevel('TREE'),
            weed: getLevel('WEED'),
        };
    }

    private getMockSolar() {
        return {
            maxSunshineHours: 1450,
            carbonOffset: 530, // kg CO2
        };
    }

    private getMockData() {
        return {
            airQuality: { aqi: 42, category: 'Good', dominantPollutant: 'PM2.5' },
            pollen: { grass: 'Low', tree: 'Moderate', weed: 'Low' },
            solar: this.getMockSolar(),
        };
    }
}
