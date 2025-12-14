
// Basic implementation of a TSP solver using 2-opt heuristic
// Replaces the Python Pulp implementation for the MVP

interface Point {
    lat: number;
    lng: number;
    id: string;
}

interface RouteRequest {
    origin: Point;
    destinations: Point[];
    end: Point; // Usually same as origin for round trip, or different for A->B
}

interface RouteResult {
    orderedStops: Point[];
    totalDistanceKm: number;
    steps: Array<{ from: string; to: string; distance: number }>;
}

// Haversine distance
function getDistance(p1: Point, p2: Point): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(p2.lat - p1.lat);
    const dLon = deg2rad(p2.lng - p1.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(p1.lat)) * Math.cos(deg2rad(p2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

function pathDistance(path: Point[]): number {
    let d = 0;
    for (let i = 0; i < path.length - 1; i++) {
        d += getDistance(path[i], path[i + 1]);
    }
    return d;
}

// 2-opt Swap
function twoOptSwap(route: Point[], i: number, k: number): Point[] {
    const newRoute = route.slice(0, i);
    const middle = route.slice(i, k + 1).reverse();
    const end = route.slice(k + 1);
    return newRoute.concat(middle).concat(end);
}

export function optimizeRoute(request: RouteRequest): RouteResult {
    // 1. Initial solution: Nearest Neighbor
    let currentPoint = request.origin;
    let unvisited = [...request.destinations];
    let route = [request.origin];

    while (unvisited.length > 0) {
        let nearestIdx = -1;
        let minDist = Infinity;

        for (let i = 0; i < unvisited.length; i++) {
            const d = getDistance(currentPoint, unvisited[i]);
            if (d < minDist) {
                minDist = d;
                nearestIdx = i;
            }
        }

        const nextPoint = unvisited[nearestIdx];
        route.push(nextPoint);
        currentPoint = nextPoint;
        unvisited.splice(nearestIdx, 1);
    }

    route.push(request.end);

    // 2. Improve with 2-Opt
    let improved = true;
    while (improved) {
        improved = false;
        // Skip start and end points in swap if they are fixed
        // Route is: Origin -> D1 -> D2 -> ... -> End
        // We can swap D1..Dn
        for (let i = 1; i < route.length - 2; i++) {
            for (let k = i + 1; k < route.length - 1; k++) {
                const existingDist = getDistance(route[i - 1], route[i]) + getDistance(route[k], route[k + 1]);
                const newDist = getDistance(route[i - 1], route[k]) + getDistance(route[i], route[k + 1]);

                if (newDist < existingDist) {
                    route = twoOptSwap(route, i, k);
                    improved = true;
                }
            }
        }
    }

    // Build steps
    const steps = [];
    let totalDist = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const d = getDistance(route[i], route[i + 1]);
        totalDist += d;
        steps.push({
            from: route[i].id,
            to: route[i + 1].id,
            distance: d
        });
    }

    return {
        orderedStops: route,
        totalDistanceKm: totalDist,
        steps
    };
}
