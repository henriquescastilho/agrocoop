"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IntelligencePanel } from "@/components/dashboard/intelligence-panel";
import { EnvironmentalSignalsPanel } from "@/components/dashboard/environmental-signals-panel";
import { ArrowUpRight, Truck, Calendar, Map, Sprout, CheckCircle2, Thermometer } from "lucide-react";
import { SimpleModal } from "@/components/ui/simple-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { apiEnabled, fetchMeta, fetchMatches } from "@/lib/api";
import { generateReport } from "@/lib/pdf-generator";

type LocalMatch = {
    id: string;
    buyer: string;
    product: string;
    distance: string;
    price: string;
    status: "Pendente" | "Confirmado" | "Negociando";
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
    const [showHarvestModal, setShowHarvestModal] = useState(false);
    const [harvestData, setHarvestData] = useState({ product: "", qty: "", window: "", notes: "" });

    // Negotiation State
    const [showNegotiationModal, setShowNegotiationModal] = useState(false);
    const [negotiationData, setNegotiationData] = useState({ price: "", reason: "" });
    const [negotiatingMatchId, setNegotiatingMatchId] = useState<string | null>(null);

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

    // ... inside component ...

    const handleReport = async () => {
        setMessage("Gerando relatório em PDF...");
        const doc = await generateReport(new Date().toLocaleString(), "Produtor (Demo)");
        doc.save(`relatorio_agrocoop_${new Date().toISOString().split('T')[0]}.pdf`);
        setMessage("Relatório salvo com sucesso.");
    };

    const handleDismiss = (id: string) => {
        const updated = localMatches.filter(m => m.id !== id);
        setLocalMatches(updated);
        setSelectedMatchId(null);
        setMessage(`Oportunidade #${id} arquivada.`);
    };

    const handleHarvest = () => {
        setShowHarvestModal(true);
    };

    const confirmHarvest = () => {
        if (!harvestData.product || !harvestData.qty) {
            alert("Preencha os campos obrigatórios");
            return;
        }
        setOperations((prev) => prev + 1);
        setMessage(`Colheita registrada: ${harvestData.product} (${harvestData.qty}). Aguardando compradores.`);
        setShowHarvestModal(false);
        setHarvestData({ product: "", qty: "", window: "", notes: "" });
    };

    const handleNegotiate = (matchId: string) => {
        setNegotiatingMatchId(matchId);
        setNegotiationData({ price: "", reason: "" });
        setShowNegotiationModal(true);
        setSelectedMatchId(null); // Close the detail modal
    };

    const confirmNegotiation = () => {
        if (!negotiationData.price) {
            alert("O preço é obrigatório para negociar.");
            return;
        }
        // Simulated backend logic below
        const updatedMatches = localMatches.map(m =>
            m.id === negotiatingMatchId ? { ...m, status: "Negociando" as const, price: `R$ ${negotiationData.price}/kg (Proposto)` } : m
        );
        setLocalMatches(updatedMatches); // Update local state for demonstration
        setMessage(`Negociação enviada: ${negotiationData.price}/kg. Aguardando comprador.`);
        // In a real app calling setLocalMatches(updatedMatches) or similar if state was lifted
        setShowNegotiationModal(false);
    };

    const confirmMatch = (id: string) => {
        const updated = localMatches.map(m => m.id === id ? { ...m, status: "Confirmado" as const } : m);
        setLocalMatches(updated);
        setMessage(`Match #${id} aceito! Logística iniciada.`);
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
                    <Button className="bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={handleHarvest}>Registrar Colheita</Button>
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

            {/* Main Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Map className="h-5 w-5 text-agro-sky" /> Inteligência Logística
                    </h2>
                    <IntelligencePanel />
                    <EnvironmentalSignalsPanel />
                    <Card className="glass-panel border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg">Mapa Operacional</CardTitle>
                            <CardDescription>Disponível apenas para o transportador.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <p className="text-sm text-muted-foreground">
                                O painel de rotas e execução foi movido para o espaço do transportador para evitar confusão de papéis.
                            </p>
                            <Button asChild variant="outline" className="whitespace-nowrap">
                                <a href="/transportador/rotas">Abrir painel do transportador</a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-agro-green" /> Oportunidades (Matches)
                    </h2>
                    <div className="space-y-3">

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
                        <CheckCircle2 className="h-4 w-4 text-agro-earth" /> Dados podem ser sincronizados via GET /api/matches.
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
                            <Button variant="outline" className="w-1/3" onClick={() => handleDismiss(activeMatch.id)}>Fechar</Button>
                            <Button className="w-1/3 bg-agro-sky/20 text-agro-sky hover:bg-agro-sky/30 border border-agro-sky/50" onClick={() => handleNegotiate(activeMatch.id)}>
                                Negociar
                            </Button>
                            <Button className="w-1/3 bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={() => confirmMatch(activeMatch.id)}>
                                Aceitar
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Ação grava apenas localmente. Para produção, enviar PATCH de status para /api/matches.</p>
                    </div>
                </div>
            )}

            <SimpleModal
                isOpen={showNegotiationModal}
                onClose={() => setShowNegotiationModal(false)}
                title="Propor Negociação"
                description="Envie uma contraproposta de preço. O comprador analisará."
            >
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Sua Proposta de Preço (R$/kg)</Label>
                        <Input
                            value={negotiationData.price}
                            onChange={(e) => setNegotiationData({ ...negotiationData, price: e.target.value })}
                            placeholder="Ex: 2,30"
                            type="number"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Justificativa (Opcional)</Label>
                        <Input
                            value={negotiationData.reason}
                            onChange={(e) => setNegotiationData({ ...negotiationData, reason: e.target.value })}
                            placeholder="Ex: Qualidade superior, custo logístico..."
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setShowNegotiationModal(false)}>Cancelar</Button>
                        <Button className="bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={confirmNegotiation}>
                            Enviar Proposta
                        </Button>
                    </div>
                </div>
            </SimpleModal>

            <SimpleModal
                isOpen={showHarvestModal}
                onClose={() => setShowHarvestModal(false)}
                title="Registrar Nova Colheita"
                description="Declare sua produção para encontrar compradores automaticamente."
            >
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="product">Produto (Obrigatório)</Label>
                        <Input
                            id="product"
                            placeholder="Ex: Tomate Italiano"
                            value={harvestData.product}
                            onChange={(e) => setHarvestData({ ...harvestData, product: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="qty">Quantidade Disponível</Label>
                        <Input
                            id="qty"
                            placeholder="Ex: 500 kg"
                            value={harvestData.qty}
                            onChange={(e) => setHarvestData({ ...harvestData, qty: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="window">Janela de Retirada (Opcional)</Label>
                        <Input
                            id="window"
                            placeholder="Ex: 15/12 a 20/12"
                            value={harvestData.window}
                            onChange={(e) => setHarvestData({ ...harvestData, window: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Input
                            id="notes"
                            placeholder="Ex: Precisa de refrigeração leve"
                            value={harvestData.notes}
                            onChange={(e) => setHarvestData({ ...harvestData, notes: e.target.value })}
                        />
                    </div>
                    <div className="pt-2 flex gap-2">
                        <Button variant="outline" className="w-full" onClick={() => setShowHarvestModal(false)}>Cancelar</Button>
                        <Button className="w-full bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={confirmHarvest}>
                            Confirmar
                        </Button>
                    </div>
                </div>
            </SimpleModal>
        </div>
    );
}
