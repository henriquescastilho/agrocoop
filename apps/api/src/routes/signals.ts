import { Router } from 'express';
import { MapBiomasService } from '../services/mapbiomas';

const router = Router();

// GET /api/signals/ambient
// Query: lat, lng, radius (optional)
router.get('/ambient', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat as string);
        const lng = parseFloat(req.query.lng as string);
        const radius = parseFloat(req.query.radius as string) || 50;

        if (isNaN(lat) || isNaN(lng)) {
            res.status(400).json({ error: 'Lat/Lng required' });
            return;
        }

        const data = await MapBiomasService.getRefinedAlerts(lat, lng, radius);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/signals/route
// Query: originLat, originLng, destLat, destLng
router.get('/route', async (req, res) => {
    try {
        const originLat = parseFloat(req.query.originLat as string);
        const originLng = parseFloat(req.query.originLng as string);
        const destLat = parseFloat(req.query.destLat as string);
        const destLng = parseFloat(req.query.destLng as string);

        if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
            res.status(400).json({ error: 'Origin and Dest coordinates required' });
            return;
        }

        const data = await MapBiomasService.getRouteContext(
            { lat: originLat, lng: originLng },
            { lat: destLat, lng: destLng }
        );
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
