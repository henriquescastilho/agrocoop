"use client";

import React, { useMemo, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Map, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapViewProps {
    markers?: Array<{ lat: number; lng: number; type: 'producer' | 'buyer'; id: string }>;
    routes?: Array<any>;
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

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    ]
};

export function MapView({ markers = [], routes = [], selectedMatchId }: MapViewProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const [map, setMap] = React.useState<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        // If we have markers, fit bounds
        if (markers.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            markers.forEach(marker => {
                bounds.extend({ lat: marker.lat, lng: marker.lng });
            });
            map.fitBounds(bounds);
        } else {
            map.setZoom(10);
        }
        setMap(map);
    }, [markers]);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    if (loadError) {
        return (
            <div className="w-full h-[400px] md:h-[500px] rounded-xl flex items-center justify-center bg-neutral-900 border border-white/10 text-red-500 gap-2">
                <Map className="h-6 w-6" />
                Erro ao carregar mapa
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-[400px] md:h-[500px] rounded-xl flex items-center justify-center bg-neutral-900 border border-white/10 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-agro-green" />
                Carregando logística...
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden relative border border-white/10 shadow-2xl">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {markers.map((marker, idx) => (
                    <Marker
                        key={`${marker.id}-${idx}`}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={marker.type === 'producer'
                            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }
                    />
                ))}
            </GoogleMap>

            {/* Floating Indicators Overlay */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <div className="bg-black/80 backdrop-blur border border-white/10 p-2 rounded-lg flex items-center gap-2 text-xs text-white shadow-xl">
                    <div className="h-2 w-2 bg-agro-green rounded-full animate-pulse" />
                    Atualização em Tempo Real
                </div>
            </div>
        </div>
    );
}
