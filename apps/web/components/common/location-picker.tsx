"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Check } from "lucide-react";

interface LocationPickerProps {
    onLocationDetected: (lat: number, lng: number) => void;
    label?: string;
    autoTrigger?: boolean;
}

export function LocationPicker({ onLocationDetected, label = "Usar Localização Atual", autoTrigger = false }: LocationPickerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetLocation = () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocalização não suportada.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });
                onLocationDetected(latitude, longitude);
                setIsLoading(false);
            },
            (err) => {
                console.error("Location error:", err);
                setError("Falha ao obter localização. Verifique permissões.");
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Auto-trigger if requested (can use useEffect elsewhere, but here logic is button-driven primarily)
    // If autoTrigger passed, maybe trigger on mount? Let's keep it simple for now and rely on button unless specified.

    return (
        <div className="flex flex-col gap-2">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                disabled={isLoading || !!coords}
                className={`flex items-center gap-2 border-agro-green/30 ${coords ? "bg-agro-green/10 text-agro-green border-agro-green" : "text-muted-foreground hover:text-agro-green"}`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Obtendo...
                    </>
                ) : coords ? (
                    <>
                        <Check className="h-4 w-4" />
                        Localização Definida
                    </>
                ) : (
                    <>
                        <MapPin className="h-4 w-4" />
                        {label}
                    </>
                )}
            </Button>

            {coords && (
                <p className="text-xs text-muted-foreground ml-1">
                    Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
                </p>
            )}

            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
}
