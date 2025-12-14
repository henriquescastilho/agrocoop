
import { Client } from "@googlemaps/google-maps-services-js";

export const mapsClient = new Client({});

export const getMapsKey = () => {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) {
        throw new Error("GOOGLE_MAPS_API_KEY is not configured");
    }
    return key;
};
