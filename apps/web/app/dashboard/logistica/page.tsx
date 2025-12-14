"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Truck, Navigation, Calendar, Sparkles, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/dashboard/map-view";
import { fetchOptimizeRoute } from "@/lib/api";

type Stop = {
    id: string;
    label: string;
    lat: number;
    lng: number;
    eta: string;
    type: "producer" | "buyer";
    note: string;
};

export default function LogisticsPage() {
    const [showHistory, setShowHistory] = useState(false);
    const [selectedStop, setSelectedStop] = useState<string>("1");
    const [logMessage, setLogMessage] = useState<string | null>(null);
    const [routePath, setRoutePath] = useState<Array<{ lat: number; lng: number }>>([]);
    const [optimizing, setOptimizing] = useState(false);

    const stops: Stop[] = useMemo(
        () => [
            { id: "1", label: "Sítio Esperança", lat: -22.25, lng: -42.5, eta: "08:30", type: "producer", note: "Folhosas • Precisa refrigeração leve" },
            { id: "2", label: "Fazenda Monte Claro", lat: -22.35, lng: -42.8, eta: "09:15", type: "producer", note: "Raízes • Sem refrigeração" },
            { id: "3", label: "CD - Comprador Zona Sul", lat: -22.95, lng: -43.2, eta: "11:40", type: "buyer", note: "Entrega única • Pagamento frete" },
        ],
        [],
    );

    const routeReason = "Menos caminhões, rota com chuva leve apenas na serra e consolidação reduzindo 18% do custo de frete.";

    const optimizeRoutePlan = async () => {
        setOptimizing(true);
        setLogMessage("Otimizando rota...");
        const origin = stops[0];
        const destinations = stops.slice(1);
        const res = await fetchOptimizeRoute({
            origin: { id: origin.id, lat: origin.lat, lng: origin.lng },
            destinations: destinations.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng })),
            end: { id: destinations[destinations.length - 1].id, lat: destinations[destinations.length - 1].lat, lng: destinations[destinations.length - 1].lng },
        });
        if (res.ok && (res as any).data.plan) {
            const plan = (res as any).data.plan;
            const path = plan.orderedStops.map((p: any) => ({ lat: p.lat, lng: p.lng }));
            setRoutePath(path);
            setLogMessage("Rota otimizada (mock) aplicada no mapa.");
        } else {
            setRoutePath(stops.map((s) => ({ lat: s.lat, lng: s.lng })));
            setLogMessage(res.ok ? "Otimização não retornou dados, exibindo rota sequencial." : `Falha ao otimizar: ${res.error}`);
        }
        setOptimizing(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Logística & Rotas</h1>
                    <p className="text-muted-foreground">Coletas consolidadas + rota explicável. Frete sempre pago pelo comprador.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowHistory((prev) => !prev)}>
                        <Calendar className="mr-2 h-4 w-4" /> {showHistory ? "Fechar histórico" : "Histórico"}
                    </Button>
                    <Badge variant="warning">Simulado</Badge>
                </div>
            </div>

            {logMessage && <p className="text-sm text-agro-sky">{logMessage}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Route */}
                <Card className="glass-panel border-white/10 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Map className="h-5 w-5 text-agro-sky" /> Mapa de Operação (Coletas)
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Sparkles className="h-4 w-4 text-agro-earth" />
                            Rota baseada em clima + distância
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <MapView
                            markers={stops.map((stop) => ({
                                id: stop.id,
                                lat: stop.lat,
                                lng: stop.lng,
                                type: stop.type,
                                label: stop.label,
                            }))}
                            routes={routePath.length > 0 ? [routePath] : []}
                            selectedMatchId={selectedStop}
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-agro-green rounded-full" />
                                Coletas mapeadas • Haversine + clima INMET (placeholder)
                            </div>
                            <div className="flex items-center gap-2">
                                <Route className="h-4 w-4 text-agro-earth" />
                                {routeReason}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Panel */}
                <div className="space-y-4">
                    <Card className="glass-panel border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg">Próxima Coleta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stops.map((stop) => (
                                <button
                                    key={stop.id}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedStop === stop.id ? "border-agro-green bg-agro-green/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                                    onClick={() => setSelectedStop(stop.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stop.type === "producer" ? "bg-agro-green/20 text-agro-green" : "bg-agro-sky/20 text-agro-sky"}`}>
                                                {stop.type === "producer" ? <Truck className="h-5 w-5" /> : <Navigation className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{stop.label}</p>
                                                <p className="text-xs text-muted-foreground">{stop.note}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">{stop.eta}</Badge>
                                    </div>
                                </button>
                            ))}

                            <Button className="w-full bg-agro-sky text-sky-950 hover:bg-agro-sky/90" onClick={optimizeRoutePlan} disabled={optimizing}>
                                {optimizing ? "Calculando rota..." : "Ver Detalhes da Rota"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-white/10 bg-agro-green/5 border-agro-green/20">
                        <CardHeader>
                            <CardTitle className="text-lg text-agro-green">Economia Logística</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-3xl font-bold">R$ 1.250,00</p>
                            <p className="text-xs text-muted-foreground">Economizados em frete compartilhado este mês.</p>
                            <div className="text-xs text-agro-earth">Por que essa rota? Consolidação 2 produtores → 1 comprador; janela antecipada por chuva às 15h.</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {showHistory && (
                <Card className="glass-panel border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5" /> Histórico de Rotas (últimos 7 dias)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span>Serra → Rio (Folhosas)</span>
                            <span className="text-muted-foreground">Economia: R$ 380 • Risco: baixo</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span>Macacu → Niterói (Raízes)</span>
                            <span className="text-muted-foreground">Economia: R$ 220 • Risco: médio (chuva)</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Dados armazenados localmente (mock). TODO: plugar histórico real na API.
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
