
import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch'; // using the installed node-fetch

const API_URL = "http://wis2bra.inmet.gov.br/oapi/collections/urn:wmo:md:br-inmet:synop/items?f=json";
const DATA_DIR = path.resolve(process.cwd(), "../../data/sources/inmet");
const LATEST_FILE = path.join(DATA_DIR, "latest.json");

interface InmetFeature {
    id: string;
    properties: {
        wigos_station_identifier: string;
        reportTime: string;
        name: string;
        value: number;
        [key: string]: any;
    };
    geometry: {
        coordinates: number[]; // [lon, lat, alt]
    };
}

interface InmetStationData {
    wigos_id: string;
    report_time: string;
    latitude: number;
    longitude: number;
    altitude: number;
    // Mapped variables
    temperatura_ar_c?: number;
    temperatura_max_c?: number;
    temperatura_min_c?: number;
    velocidade_vento_ms?: number;
    direcao_vento_deg?: number;
    rajada_vento_ms?: number;
    precipitacao_mm?: number;
    umidade_relativa_perc?: number;
    pressao_hpa?: number;
    ponto_orvalho_c?: number;
    radiacao_solar_j_m2?: number;
}

const VARIABLE_MAP: Record<string, keyof InmetStationData> = {
    "air_temperature": "temperatura_ar_c",
    "maximum_air_temperature_at_height_and_over_period_specified": "temperatura_max_c",
    "minimum_air_temperature_at_height_and_over_period_specified": "temperatura_min_c",
    "wind_speed": "velocidade_vento_ms",
    "wind_direction": "direcao_vento_deg",
    "maximum_wind_gust_speed": "rajada_vento_ms",
    "total_precipitation_or_total_water_equivalent": "precipitacao_mm",
    "relative_humidity": "umidade_relativa_perc",
    "non_coordinate_pressure": "pressao_hpa",
    "dewpoint_temperature": "ponto_orvalho_c",
    "net_radiation_integrated_over_period_specified": "radiacao_solar_j_m2"
};

export async function collectInmetData() {
    try {
        console.log(`[inmet] starting collection from ${API_URL}`);
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch INMET data: ${response.statusText}`);
        }

        const data = await response.json() as { features: InmetFeature[] };
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

        const stationsData: Record<string, InmetStationData> = {};

        for (const feature of data.features) {
            const props = feature.properties;
            const geom = feature.geometry;
            const wigosId = props.wigos_station_identifier;
            const reportTimeStr = props.reportTime;

            if (!wigosId || !reportTimeStr) continue;

            const reportTime = new Date(reportTimeStr);
            if (isNaN(reportTime.getTime()) || reportTime < twoHoursAgo) {
                continue; // Skip old or invalid data
            }

            const key = `${wigosId}_${reportTimeStr}`;

            if (!stationsData[key]) {
                stationsData[key] = {
                    wigos_id: wigosId,
                    report_time: reportTimeStr,
                    latitude: geom.coordinates[1],
                    longitude: geom.coordinates[0],
                    altitude: geom.coordinates[2] || 0
                };
            }

            const varName = props.name;
            const mappedName = VARIABLE_MAP[varName];

            if (mappedName && props.value !== undefined) {
                // @ts-ignore
                stationsData[key][mappedName] = props.value;
            }
        }

        const processedData = Object.values(stationsData);

        // Ensure dir exists
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        const snapshot = {
            source: "inmet",
            timestamp: now.toISOString(),
            count: processedData.length,
            data: processedData
        };

        fs.writeFileSync(LATEST_FILE, JSON.stringify(snapshot, null, 2));

        // Also save history
        const dateStr = now.toISOString().split('T')[0];
        const historyFile = path.join(DATA_DIR, "history", `${dateStr}.json`);
        fs.writeFileSync(historyFile, JSON.stringify(snapshot, null, 2));

        console.log(`[inmet] collected ${processedData.length} stations. saved to ${LATEST_FILE}`);
        return snapshot;

    } catch (error) {
        console.error("[inmet] failed to collect data", error);
        return null; // Don't crash app
    }
}

export function getLatestInmetData() {
    try {
        if (fs.existsSync(LATEST_FILE)) {
            const raw = fs.readFileSync(LATEST_FILE, 'utf-8');
            return JSON.parse(raw);
        }
    } catch {
        return null;
    }
    return null;
}
