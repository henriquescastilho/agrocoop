"use client";

import React, { useMemo, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle, Polyline } from "@react-google-maps/api";
import { Map, Loader2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MapViewProps {
    markers?: Array<{ lat: number; lng: number; type: "producer" | "buyer"; id: string; label?: string }>;
    routes?: Array<Array<{ lat: number; lng: number }>>; // Array of paths
    overlays?: Array<{ lat: number; lng: number; radius: number; color: string }>;
    selectedMatchId?: string | null;
}

const containerStyle = {
    width: "100%",
    height: "100%",
};

// Rio de Janeiro center
const defaultCenter = {
    lat: -22.9068,
    lng: -43.1729,
};

const darkMapStyle: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#0f1617" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8da6a3" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0f1617" }] },
    { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#9db8b2" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#0f1617" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#123026" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#143528" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b1d2b" }] },
];

const markerIcons: Record<"producer" | "buyer", google.maps.Symbol> = {
    producer: {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
        fillColor: "#4CAF50",
        fillOpacity: 0.95,
        strokeColor: "#1A4633",
        strokeWeight: 1.2,
        scale: 1,
    },
    buyer: {
        path: "M12 2C8.13401 2 5 5.13401 5 9C5 13.9706 12 22 12 22C12 22 19 13.9706 19 9C19 5.13401 15.866 2 12 2Z",
        fillColor: "#2E6B85",
        fillOpacity: 0.95,
        strokeColor: "#163749",
        strokeWeight: 1.2,
        scale: 1,
    },
};

export function MapView({ markers = [], routes = [], overlays = [], selectedMatchId }: MapViewProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
    const hasKey = apiKey.length > 0;

    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: apiKey,
    });

    const [map, setMap] = React.useState<google.maps.Map | null>(null);

    const onLoad = useCallback(
        function callback(map: google.maps.Map) {
            const bounds = new window.google.maps.LatLngBounds();

            if (markers.length > 0) {
                markers.forEach((marker) => {
                    bounds.extend({ lat: marker.lat, lng: marker.lng });
                });
            }

            if (routes.length > 0) {
                routes.forEach(path => {
                    path.forEach(point => bounds.extend(point));
                });
            }

            if (markers.length > 0 || routes.length > 0) {
                map.fitBounds(bounds);
            } else {
                map.setZoom(9);
            }

            setMap(map);
        },
        [markers, routes],
    );

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    const legend = useMemo(
        () => [
            { color: "bg-agro-green", label: "Produtor" },
            { color: "bg-agro-sky", label: "Comprador" },
            { color: "bg-red-500", label: "Rota Otimizada" },
        ],
        [],
    );

    const routeOptions = useMemo(() => {
        // Only generate options if google is loaded
        if (typeof google === "undefined") return null;

        return {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: "#FF0000",
                    scale: 3
                },
                offset: '0',
                repeat: '50px'
            }]
        };
    }, [isLoaded]);

    if (!hasKey) {
        return (
            <div className="w-full h-[420px] md:h-[520px] rounded-[28px] relative overflow-hidden border border-white/10 bg-gradient-to-br from-black/70 via-agro-dark/60 to-agro-sky/20 flex items-center justify-center text-center p-6 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(46,107,133,0.15),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(184,155,68,0.12),transparent_40%)]" />
                <div className="relative space-y-3 max-w-lg">
                    <div className="flex items-center justify-center gap-2 text-agro-earth">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="font-semibold">Mapa bloqueado</span>
                    </div>
                    <p className="text-muted-foreground">
                        Insira a variável <code className="px-2 py-1 rounded bg-black/30 border border-white/10">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> em <code>.env.local</code> para ativar o mapa vivo.
                    </p>
                    <Badge variant="warning" className="bg-agro-earth/30 border-agro-earth/40 text-agro-dark">Placeholder</Badge>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="w-full h-[420px] md:h-[520px] rounded-[28px] flex items-center justify-center bg-neutral-900 border border-white/10 text-red-500 gap-2">
                <Map className="h-6 w-6" />
                Erro ao carregar mapa
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-[420px] md:h-[520px] rounded-[28px] flex items-center justify-center bg-neutral-900 border border-white/10 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-agro-green" />
                Carregando logística...
            </div>
        );
    }

    return (
        <div className="w-full h-[420px] md:h-[520px] rounded-[28px] overflow-hidden relative border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-black/40 z-10" />
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={9}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: darkMapStyle,
                    minZoom: 6,
                    clickableIcons: false,
                }}
            >
                {markers.map((marker, idx) => (
                    <Marker
                        key={marker.id || idx}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={markerIcons[marker.type]}
                        label={marker.label ? { text: marker.label, color: "#e5e7eb", fontSize: "10px", className: "map-label" } : undefined}
                    />
                ))}

                {routes.map((path, idx) => (
                    routeOptions && <Polyline
                        key={`route-${idx}`}
                        path={path}
                        options={routeOptions}
                    />
                ))}

                {overlays?.map((overlay, idx) => (
                    <Circle
                        key={`overlay-${idx}`}
                        center={{ lat: overlay.lat, lng: overlay.lng }}
                        radius={overlay.radius * 1000} // km to meters
                        options={{
                            fillColor: overlay.color,
                            fillOpacity: 0.2,
                            strokeColor: overlay.color,
                            strokeOpacity: 0.4,
                            strokeWeight: 1,
                        }}
                    />
                ))}
            </GoogleMap>

            {/* Floating Indicators Overlay */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 items-center z-20">
                {legend.map((item) => (
                    <div key={item.label} className="bg-black/70 backdrop-blur border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] text-white">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                        {item.label}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                <div className="bg-black/80 backdrop-blur border border-white/10 p-2 rounded-lg flex items-center gap-2 text-xs text-white shadow-xl">
                    <div className="h-2 w-2 bg-agro-green rounded-full animate-pulse" />
                    Atualização em Tempo Real (Simulado)
                </div>
                {selectedMatchId && <Badge variant="outline" className="self-end bg-white/10">Match selecionado #{selectedMatchId}</Badge>}
            </div>
        </div>
    );
}
