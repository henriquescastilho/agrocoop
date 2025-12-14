import { Router } from 'express';
import { GoogleEnvironmentalService } from '../services/google-environment';

const router = Router();
const envService = new GoogleEnvironmentalService();

// GET /api/signals/ambient
// Query: lat, lng
router.get('/ambient', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat as string);
        const lng = parseFloat(req.query.lng as string);

        if (isNaN(lat) || isNaN(lng)) {
            res.status(400).json({ error: 'Lat/Lng required' });
            return;
        }

        const data = await envService.getEnvironmentalData(lat, lng);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/signals/route
// Query: originLat, originLng, destLat, destLng
router.get('/route', async (req, res) => {
    // Route environmental signals not yet fully implemented in Google Service
    // Returning simple mocked context for now
    res.json({
        summary: "Rota monitorada via Google Environment",
        hazards: []
    });
});

export default router;
