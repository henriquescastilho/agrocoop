"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/dashboard/map-view";
import { IntelligencePanel } from "@/components/dashboard/intelligence-panel";
import { EnvironmentalSignalsPanel } from "@/components/dashboard/environmental-signals-panel";
import { ArrowUpRight, Truck, Calendar, Map, Sprout, CheckCircle2, Thermometer } from "lucide-react";
import { apiEnabled, fetchMeta, fetchMatches } from "@/lib/api";

type LocalMatch = {
    id: string;
    buyer: string;
    product: string;
    distance: string;
    price: string;
    status: "Pendente" | "Confirmado";
    window: string;
};

export default function DashboardPage() {
    const [message, setMessage] = useState<string | null>(null);
    const [operations, setOperations] = useState(1);
    const [metaCounts, setMetaCounts] = useState<{ offers: number; matches: number } | null>(null);
    const [matchMarkers, setMatchMarkers] = useState<
        Array<{ lat: number; lng: number; type: "producer" | "buyer"; id: string; label?: string }>
    >([
        { lat: -22.25, lng: -42.5, type: "producer", id: "s1", label: "Sítio Esperança" },
        { lat: -22.35, lng: -42.8, type: "producer", id: "s2", label: "Monte Claro" },
        { lat: -22.95, lng: -43.2, type: "buyer", id: "b1", label: "CD Zona Sul" },
    ]);
    const [localMatches, setLocalMatches] = useState<LocalMatch[]>([
        { id: "1", buyer: "Rede Hortifruti Zona Sul", product: "Tomate Italiano", distance: "45km", price: "R$ 4,50/kg", status: "Pendente", window: "Amanhã" },
        { id: "2", buyer: "Restaurante Alecrim", product: "Batata Inglesa", distance: "120km", price: "R$ 2,10/kg", status: "Pendente", window: "Próximo dia útil" },
    ]);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    useEffect(() => {
        if (!apiEnabled) return;
        fetchMeta().then((res) => {
            if (res.ok) {
                setMetaCounts({ offers: res.data.counts.offers, matches: res.data.counts.matches });
            }
        });
        fetchMatches().then((res) => {
            if (res.ok && res.data.matches.length > 0) {
                const markers = res.data.matches.flatMap((m) => [
                    m.offer.location.lat && m.offer.location.lng
                        ? {
                            id: `offer-${m.id}`,
                            lat: m.offer.location.lat,
                            lng: m.offer.location.lng,
                            type: "producer" as const,
                            label: m.offer.user.name || "Produtor",
                        }
                        : null,
                    m.demand.location.lat && m.demand.location.lng
                        ? {
                            id: `demand-${m.id}`,
                            lat: m.demand.location.lat,
                            lng: m.demand.location.lng,
                            type: "buyer" as const,
                            label: m.demand.user.name || "Comprador",
                        }
                        : null,
                ]).filter(Boolean) as typeof matchMarkers;
                if (markers.length > 0) setMatchMarkers(markers);
            }
        });
    }, []);

    const activeMatch = useMemo(() => localMatches.find((m) => m.id === selectedMatchId) || null, [localMatches, selectedMatchId]);

    const handleReport = () => {
        setMessage("Relatório estratégico gerado (mock). Em produção, salvar em REPORTS/RAIOX_UI.md + download.");
    };

    const handleOperation = () => {
        setOperations((prev) => prev + 1);
        setMessage("Nova operação criada (simulação). Próximo passo: registrar coleta na API.");
    };

    const confirmMatch = (id: string) => {
        setLocalMatches((prev) => prev.map((m) => (m.id === id ? { ...m, status: "Confirmado" } : m)));
        setMessage("Match confirmado localmente. Em produção, enviar patch para API.");
        setSelectedMatchId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
                    <p className="text-muted-foreground">Agricultor conectado. Estoque, matches e logística consolidados.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReport}>Baixar Relatório</Button>
                    <Button className="bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={handleOperation}>Nova Operação</Button>
                </div>
            </div>

            {message && <p className="text-sm text-agro-sky">{message}</p>}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-panel border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Economia Gerada</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-agro-green" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 12.450</div>
                        <p className="text-xs text-muted-foreground">+18% vs mês anterior</p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Operações Ativas</CardTitle>
                        <Truck className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{operations}</div>
                        <p className="text-xs text-muted-foreground">
                            Coletas sincronizadas {metaCounts ? `• Ofertas: ${metaCounts.offers}` : ""}
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clima (INMET)</CardTitle>
                        <Thermometer className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">28°C</div>
                        <p className="text-xs text-muted-foreground">Chuva prevista em 2h</p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Próxima Safra</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15/Out</div>
                        <p className="text-xs text-muted-foreground">Tomate (Região Serrana)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Map Integration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Column */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Map className="h-5 w-5 text-agro-sky" /> Inteligência Logística
                    </h2>
                    <IntelligencePanel />
                    <EnvironmentalSignalsPanel />
                    <MapView
                        markers={matchMarkers}
                        overlays={[{ lat: -22.1, lng: -42.7, radius: 15, color: "#EF4444" }]} // Mock overlay for immediate visual feedback
                        selectedMatchId={matchMarkers[0]?.id ?? null}
                    />
                </div>

                {/* Matches Column */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-agro-green" /> Oportunidades (Matches)
                    </h2>
                    <div className="space-y-3">

                        {/* Match Card 1 */}
                        {localMatches.map((match) => (
                            <Card key={match.id} className="hover:border-agro-green/50 transition-colors cursor-pointer glass-panel border-white/5 bg-transparent">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <Badge variant={match.status === "Confirmado" ? "success" : "warning"}>
                                            {match.status === "Confirmado" ? "Confirmado" : "Pendente"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{match.window}</span>
                                    </div>
                                    <h3 className="font-bold text-lg">{match.product}</h3>
                                    <p className="text-sm text-muted-foreground">{match.buyer} • {match.distance}</p>

                                    <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded border border-white/5">
                                        <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Frete Compartilhado</span>
                                        <span className="font-bold text-agro-green">{match.price}</span>
                                    </div>

                                    <Button size="sm" className="w-full bg-white/10 hover:bg-white/20" onClick={() => setSelectedMatchId(match.id)}>
                                        Ver Detalhes
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-agro-earth" /> Itens simulados. Em produção, puxar de GET /api/matches.
                    </div>
                </div>
            </div>

            {activeMatch && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4" onClick={() => setSelectedMatchId(null)}>
                    <div className="w-full max-w-lg bg-card border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Match #{activeMatch.id}</h3>
                            <Badge variant={activeMatch.status === "Confirmado" ? "success" : "warning"}>{activeMatch.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {activeMatch.product} para {activeMatch.buyer} • {activeMatch.distance} • Janela {activeMatch.window}
                        </p>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-sm">Preço sugerido</span>
                            <span className="font-bold text-agro-green">{activeMatch.price}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="w-1/2" onClick={() => setSelectedMatchId(null)}>Fechar</Button>
                            <Button className="w-1/2 bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={() => confirmMatch(activeMatch.id)}>
                                Aceitar / Negociar
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Ação grava apenas localmente. Para produção, enviar PATCH de status para /api/matches.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
