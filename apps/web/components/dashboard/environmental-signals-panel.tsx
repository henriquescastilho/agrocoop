"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind, Sun, AlertTriangle, Info, CheckCircle2, CloudFog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiBase, apiEnabled } from "@/lib/api";

interface AirQuality {
    aqi: number;
    category: string;
    dominantPollutant: string;
}

interface Pollen {
    grass: string;
    tree: string;
    weed: string;
}

interface EnvironmentalData {
    airQuality?: AirQuality;
    pollen?: Pollen;
    solar?: { maxSunshineHours: number; carbonOffset: number };
}

export function EnvironmentalSignalsPanel() {
    const [data, setData] = useState<EnvironmentalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Fetch signals for a default location (e.g., RJ Serra) or current user location
        const lat = -22.25;
        const lng = -42.50;
        const base = apiBase;

        if (!apiEnabled) {
            setLoading(false);
            return;
        }

        fetch(`${base}/api/signals/ambient?lat=${lat}&lng=${lng}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch environmental signals", err);
                setError(true);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Card className="glass-panel border-white/10 opacity-80">
                <CardContent className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
                    <CloudFog className="h-4 w-4 animate-pulse" /> Analisando atmosfera...
                </CardContent>
            </Card>
        );
    }

    if (error || !data) {
        return (
            <Card className="glass-panel border-white/10 bg-agro-earth/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                        <Wind className="h-4 w-4" />
                        Sinais Ambientais
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Dados indisponíveis no momento. Verifique a chave de API (Gemini/Google Maps).</p>
                </CardContent>
            </Card>
        );
    }

    const aqiColor = (category: string) => {
        if (category === "Good") return "text-agro-green";
        if (category === "Moderate") return "text-yellow-500";
        return "text-destructive";
    };

    return (
        <Card className="glass-panel border-white/10 relative overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wind className="h-4 w-4 text-agro-sky" />
                    Monitoramento Ambiental
                </CardTitle>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px]">Google Environment</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Air Quality Section */}
                {data.airQuality && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-black/20 ${aqiColor(data.airQuality.category)}`}>
                                <span className="text-lg font-bold">{data.airQuality.aqi}</span>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Qualidade do Ar</p>
                                <p className="font-semibold text-sm">{data.airQuality.category}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-muted-foreground">Poluente</p>
                            <p className="text-xs font-mono">{data.airQuality.dominantPollutant}</p>
                        </div>
                    </div>
                )}

                {/* Pollen Section */}
                {data.pollen && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Níveis de Pólen
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-white/5 rounded border border-white/5 text-center">
                                <p className="text-[10px] text-muted-foreground">Gramíneas</p>
                                <p className="font-medium text-xs">{data.pollen.grass}</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded border border-white/5 text-center">
                                <p className="text-[10px] text-muted-foreground">Árvores</p>
                                <p className="font-medium text-xs">{data.pollen.tree}</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded border border-white/5 text-center">
                                <p className="text-[10px] text-muted-foreground">Ervas</p>
                                <p className="font-medium text-xs">{data.pollen.weed}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Solar Potential (Mocked/Available) */}
                {data.solar && (
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-yellow-500/80">
                            <Sun className="h-3 w-3" />
                            <span>Potencial Solar</span>
                        </div>
                        <span className="font-mono text-muted-foreground">{data.solar.maxSunshineHours}h/ano</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
