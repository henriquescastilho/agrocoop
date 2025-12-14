"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/dashboard/map-view";
import { Navigation, Clock, AlertTriangle } from "lucide-react";

const defaultStops = [
    { id: "1", label: "Sítio Vista Alegre", lat: -22.41, lng: -42.96, type: "producer" as const, note: "Folhosas • Refrigeração leve" },
    { id: "2", label: "Fazenda Sol Nascente", lat: -22.52, lng: -43.1, type: "producer" as const, note: "Raízes" },
    { id: "3", label: "CEASA Rio", lat: -22.9, lng: -43.23, type: "buyer" as const, note: "Entrega final" },
];

export default function TransportadorRotasPage() {
    const [timestamp, setTimestamp] = useState<string>(new Date().toLocaleTimeString());
    const [optimizedStops, setOptimizedStops] = useState(defaultStops);
    const [analysis, setAnalysis] = useState("Aguardando análise de inteligência...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = setInterval(() => setTimestamp(new Date().toLocaleTimeString()), 8000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const fetchOptimization = async () => {
            try {
                // Determine API URL locally or from env
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

                // Construct payload: Origin is first stop, Destinations are all stops (API handles reordering)
                const payload = {
                    origin: { lat: defaultStops[0].lat, lng: defaultStops[0].lng, id: defaultStops[0].id },
                    destinations: defaultStops.map(s => ({ lat: s.lat, lng: s.lng, id: s.id }))
                };

                const res = await fetch(`${baseUrl}/api/routing/optimize`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();

                    // Reorder defaultStops based on plan.orderedStops IDs
                    if (data.plan && Array.isArray(data.plan.orderedStops)) {
                        const orderMap = new Map<string, number>();
                        data.plan.orderedStops.forEach((s: { id: string }, idx: number) => {
                            orderMap.set(s.id, idx);
                        });

                        const reordered = [...defaultStops].sort((a, b) => {
                            const indexA = orderMap.get(a.id) ?? 999;
                            const indexB = orderMap.get(b.id) ?? 999;
                            return indexA - indexB;
                        });
                        setOptimizedStops(reordered);
                    }

                    if (data.analysis) {
                        setAnalysis(data.analysis);
                    }
                }
            } catch (error) {
                console.error("Erro ao otimizar rota:", error);
                setAnalysis("Falha na conexão com inteligência. Usando rota padrão.");
            } finally {
                setLoading(false);
            }
        };

        fetchOptimization();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Logística & Rotas</h1>
                    <p className="text-muted-foreground">Mapa operacional exclusivo do transportador.</p>
                </div>
                <Badge variant="outline" className="bg-white/5 text-xs">Atualizado agora • {timestamp}</Badge>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            <Navigation className="h-5 w-5 text-agro-sky" /> Rota Ativa
                        </CardTitle>
                        <CardDescription>Otimização inteligente via Google Directions API + Gemini.</CardDescription>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Clock className="h-4 w-4" /> Tick a cada poucos segundos
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <MapView
                        markers={optimizedStops.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, type: s.type, label: s.label }))}
                        selectedMatchId={"1"}
                        className="h-[520px]"
                    />
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-agro-sky">
                            {loading ? <Clock className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                            <span className="font-medium">Análise IA:</span> {analysis}
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <Navigation className="h-4 w-4 text-agro-green" /> Traçado real de vias
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg">Próximas Paradas (Otimizadas)</CardTitle>
                    <CardDescription>Ordem sugerida para máxima eficiência.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-3">
                    {optimizedStops.map((stop, idx) => (
                        <div key={stop.id} className="p-3 rounded-lg border border-white/10 bg-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{stop.label}</p>
                                <Badge variant={stop.type === "buyer" ? "success" : "outline"} className="text-[11px]">
                                    {stop.type === "buyer" ? "Entrega" : "Coleta"} #{idx + 1}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{stop.note}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
}
