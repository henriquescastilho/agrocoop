"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/dashboard/map-view";
import { PanelsTopLeft, Navigation, CloudRain, Route, Check } from "lucide-react";
import { fetchOptimizeRoute } from "@/lib/api";

const routeSteps = [
    { id: "s1", label: "Produtor - Serra", eta: "08:10", note: "Carregar 1.2 ton", type: "producer", lat: -22.25, lng: -42.5 },
    { id: "s2", label: "Produtor - Teresópolis", eta: "09:00", note: "Carregar 0.8 ton", type: "producer", lat: -22.35, lng: -42.8 },
    { id: "b1", label: "Base Comprador - Rio", eta: "11:40", note: "Recepção + inspeção", type: "buyer", lat: -22.9, lng: -43.2 },
];

export default function BuyerRoutesPage() {
    const [selected, setSelected] = useState<string>("b1");
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [routePath, setRoutePath] = useState<Array<{ lat: number; lng: number }>>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem("agrocoop:buyer-route");
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as { confirmed: boolean; path: Array<{ lat: number; lng: number }>; message?: string };
                setConfirmed(parsed.confirmed);
                setRoutePath(parsed.path || []);
                if (parsed.message) setStatusMessage(parsed.message);
            } catch {
                // ignore
            }
        }
    }, []);

    const persistRoute = (payload: { confirmed: boolean; path: Array<{ lat: number; lng: number }>; message?: string }) => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("agrocoop:buyer-route", JSON.stringify(payload));
        }
    };

    const handleConfirm = async () => {
        setIsSaving(true);
        setStatusMessage("Gerando rota otimizada...");
        const origin = routeSteps[0];
        const destinations = routeSteps.slice(1);
        const payload = {
            origin: { id: origin.id, lat: origin.lat, lng: origin.lng },
            destinations: destinations.map((d) => ({ id: d.id, lat: d.lat, lng: d.lng })),
            end: { id: destinations[destinations.length - 1].id, lat: destinations[destinations.length - 1].lat, lng: destinations[destinations.length - 1].lng },
        };

        const res = await fetchOptimizeRoute(payload);
        if (res.ok && (res as any).data.plan) {
            const plan = (res as any).data.plan;
            const path = plan.orderedStops.map((p: any) => ({ lat: p.lat, lng: p.lng }));
            setRoutePath(path);
            setConfirmed(true);
            setStatusMessage("Rota confirmada e otimizada.");
            persistRoute({ confirmed: true, path, message: "Rota confirmada" });
        } else {
            const fallbackPath = routeSteps.map((s) => ({ lat: s.lat, lng: s.lng }));
            setRoutePath(fallbackPath);
            setConfirmed(true);
            const msg = `Rota confirmada localmente. ${res.ok ? "Plano indisponível" : res.error}`;
            setStatusMessage(msg);
            persistRoute({ confirmed: true, path: fallbackPath, message: msg });
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rotas & Consolidação</h1>
                    <p className="text-muted-foreground">Comprador paga o frete, AgroCoop otimiza antes de sair do armazém.</p>
                </div>
                <Badge variant={confirmed ? "success" : "warning"}>{confirmed ? "Confirmada" : "Simulado"}</Badge>
            </div>

            {statusMessage && <p className="text-sm text-agro-sky">{statusMessage}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="glass-panel border-white/10 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PanelsTopLeft className="h-5 w-5 text-agro-sky" /> Rota Consolidada
                        </CardTitle>
                        <CardDescription>Haversine + clima (placeholder) + custo estimado de frete.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <MapView
                            markers={routeSteps.map((step) => ({
                                id: step.id,
                                type: step.type as "producer" | "buyer",
                                lat: step.lat,
                                lng: step.lng,
                                label: step.label,
                            }))}
                            routes={routePath.length > 0 ? [routePath] : []}
                            selectedMatchId={selected}
                        />
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Route className="h-4 w-4 text-agro-earth" /> Por que essa rota? 2 produtores → 1 comprador, chuva prevista só após 14h.
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg">Sequência de Paradas</CardTitle>
                        <CardDescription>Escolha a parada para ver detalhes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {routeSteps.map((step) => (
                            <button
                                key={step.id}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${selected === step.id ? "border-agro-sky bg-agro-sky/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                                onClick={() => setSelected(step.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step.type === "producer" ? "bg-agro-green/20 text-agro-green" : "bg-agro-sky/20 text-agro-sky"}`}>
                                            <Navigation className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{step.label}</p>
                                            <p className="text-xs text-muted-foreground">{step.note}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{step.eta}</Badge>
                                </div>
                            </button>
                        ))}

                        <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-3 text-sm text-muted-foreground flex items-center gap-2">
                            <CloudRain className="h-4 w-4 text-agro-sky" />
                            Placeholder clima: ajustar saída se chover na serra. TODO: plugar INMET.
                        </div>

                        <Button
                            className="w-full bg-agro-sky text-sky-950 hover:bg-agro-sky/90"
                            onClick={handleConfirm}
                            disabled={isSaving}
                        >
                            {confirmed ? <><Check className="h-4 w-4 mr-2" /> Rota Confirmada</> : "Confirmar rota simulada"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
