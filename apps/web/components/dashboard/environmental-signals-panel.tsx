"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TreePine, Loader2, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiBase, apiEnabled } from "@/lib/api";

interface Alert {
    id: number;
    code: number;
    date: string;
    area: number;
    biome: string;
    distanceKm: number;
}

interface SignalsData {
    status: "ok" | "missing_config" | "auth_failed" | "error";
    source: string;
    alerts: Alert[];
}

export function EnvironmentalSignalsPanel() {
    const [data, setData] = useState<SignalsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [configured, setConfigured] = useState<boolean>(false);

    useEffect(() => {
        // Fetch signals for a default location (e.g., RJ Serra) or current user location
        // For MVP, hardcoded "Serra" coordinates approx.
        // In real app, props.lat/lng
        const lat = -22.25;
        const lng = -42.50;
        const saved = typeof window !== "undefined" ? window.localStorage.getItem("agrocoop:signals-configured") : null;
        if (saved === "true") setConfigured(true);

        const base = apiBase;
        fetch(`${base}/api/signals/ambient?lat=${lat}&lng=${lng}&radius=50`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch signals", err);
                setData({ status: "error", source: "api", alerts: [] });
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Card className="glass-panel border-white/10 opacity-80">
                <CardContent className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Carregando sinais ambientais...
                </CardContent>
            </Card>
        );
    }

    if (!data || data.status === "missing_config" || data.status === "auth_failed" || !apiEnabled) {
        return (
            <Card className="glass-panel border-white/10 bg-agro-earth/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-agro-earth">
                        <TreePine className="h-4 w-4" />
                        Sinais Ambientais (MapBiomas)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-black/20 p-3 rounded-lg border border-white/5">
                        <Info className="h-4 w-4 mt-0.5" />
                        <p>
                            Integração disponível, mas não configurada. Adicione as credenciais no servidor para ver alertas reais de desmatamento.
                            Base atual: {apiBase}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-agro-earth/30 text-agro-earth hover:bg-agro-earth/10"
                        onClick={() => {
                            setConfigured(true);
                            if (typeof window !== "undefined") window.localStorage.setItem("agrocoop:signals-configured", "true");
                        }}
                    >
                        Marcar como configurado
                    </Button>
                    {configured && <p className="text-xs text-agro-earth">Configuração salva localmente. Atualize com credenciais reais no backend.</p>}
                </CardContent>
            </Card>
        );
    }

    // Example of high risk simulation if alerts exist
    const hasAlerts = data.alerts.length > 0;
    const riskLevel = hasAlerts ? (data.alerts.length > 5 ? "Alto" : "Médio") : "Baixo";

    return (
        <Card className="glass-panel border-white/10 relative overflow-hidden">
            <div className={`absolute top-0 w-full h-1 ${riskLevel === "Alto" ? "bg-red-500" : riskLevel === "Médio" ? "bg-yellow-500" : "bg-agro-green"}`} />
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TreePine className="h-4 w-4 text-agro-green" />
                    Sinais Ambientais
                </CardTitle>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Fonte: MapBiomas Alerta</span>
                    {hasAlerts && <Badge variant="destructive" className="animate-pulse">Risco {riskLevel}</Badge>}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {hasAlerts ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider">
                            <span>Alerta</span>
                            <span>Distância</span>
                        </div>
                        {data.alerts.slice(0, 3).map(alert => (
                            <div key={alert.id} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                    <div>
                                        <p className="text-xs font-bold">Desmatamento ({alert.biome})</p>
                                        <p className="text-[10px] text-muted-foreground">{new Date(alert.date).toLocaleDateString()} • {alert.area} ha</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono">{alert.distanceKm} km</span>
                            </div>
                        ))}
                        {data.alerts.length > 3 && <p className="text-xs text-center text-muted-foreground">+ {data.alerts.length - 3} outros alertas na região.</p>}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
                        <div className="h-10 w-10 bg-agro-green/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-agro-green" />
                        </div>
                        <p className="text-sm font-medium">Região Monitorada</p>
                        <p className="text-xs text-muted-foreground">Nenhum alerta crítico detectado nos últimos 50km.</p>
                    </div>
                )}

                <div className="pt-2 border-t border-white/5">
                    <p className="text-xs text-muted-foreground">
                        A análise cruzada indica {riskLevel === "Baixo" ? "conformidade ambiental" : `atenção para ${data.alerts.length} pontos de pressão`}.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
