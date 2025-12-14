"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Check, X, ArrowUpRight, Route, Sparkles, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiEnabled, fetchMatches } from "@/lib/api";

export default function PedidosPage() {
    const [matches, setMatches] = useState<Array<{ id: string; buyer: string; product: string; volume: string; price: string; status: string }>>([
        { id: "1", buyer: "Rede Hortifruti Zona Sul", product: "Tomate Italiano", volume: "500kg", price: "R$ 4,80/kg", status: "Pendente" },
        { id: "2", buyer: "Restaurante Alecrim", product: "Alface Crespa", volume: "50 un", price: "R$ 2,50/un", status: "Confirmado" },
    ]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!apiEnabled) return;
        fetchMatches().then((res) => {
            if (res.ok && res.data.matches.length > 0) {
                const normalized = res.data.matches.map((m) => ({
                    id: m.id,
                    buyer: m.demand.user.name || "Comprador",
                    product: m.product.name,
                    volume: `${m.demand.qty} ${m.product.unit}`,
                    price: m.guidance?.suggestedPriceRange ? `R$ ${m.guidance.suggestedPriceRange.min?.toFixed(2) ?? "?"} - ${m.guidance.suggestedPriceRange.max?.toFixed(2) ?? "?"}` : "Preço a negociar",
                    status: m.status === "accepted" ? "Confirmado" : "Pendente",
                }));
                setMatches(normalized);
                setMessage("Matches carregados da API.");
            } else if (!res.ok) {
                setMessage(`Não foi possível carregar matches da API: ${res.error}`);
            }
        });
    }, []);

    const handleAccept = (id: string) => {
        setMatches(matches.map(m => m.id === id ? { ...m, status: "Confirmado" } : m));
        setMessage("Match aceito. Logística simulada iniciada. TODO: integrar PATCH de status na API.");
    };

    const handleReject = (id: string) => {
        setMatches(matches.filter(m => m.id !== id));
        setMessage("Proposta recusada. Em produção chamar DELETE /api/matches/:id.");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-between justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pedidos & Matches</h1>
                    <p className="text-muted-foreground">Oportunidades encontradas pela nossa Inteligência (Simulado).</p>
                </div>
            </div>

            {message && <p className="text-sm text-agro-sky">{message}</p>}

            <div className="grid gap-4">
                {matches.map((match) => (
                    <Card key={match.id} className="glass-panel border-white/10 w-full relative overflow-hidden">
                        {match.status === "Confirmado" && (
                            <div className="absolute top-0 right-0 p-4">
                                <Badge variant="success" className="bg-agro-green text-agro-dark">Confirmado</Badge>
                            </div>
                        )}

                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">

                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    {match.buyer}
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </h3>
                                <p className="text-sm text-muted-foreground">Interesse em: <span className="text-foreground font-medium">{match.product}</span></p>
                            </div>

                            <div className="flex items-center gap-8 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Volume</p>
                                    <p className="font-medium text-lg">{match.volume}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Preço Sugerido</p>
                                    <p className="font-medium text-lg text-agro-green">{match.price}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge variant="warning">Simulado</Badge>
                                <Link href="/dashboard/logistica" className="text-sm text-agro-sky flex items-center gap-1 hover:underline">
                                    <Map className="h-4 w-4" /> Ver rota e coletas
                                </Link>
                            </div>

                            {match.status === "Pendente" ? (
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Button onClick={() => handleReject(match.id)} variant="outline" className="flex-1 md:flex-none border-destructive/50 text-destructive hover:bg-destructive/10">
                                        <X className="mr-2 h-4 w-4" /> Recusar
                                    </Button>
                                    <Button onClick={() => handleAccept(match.id)} className="flex-1 md:flex-none bg-agro-green text-agro-dark hover:bg-agro-green/90">
                                        <Check className="mr-2 h-4 w-4" /> Aceitar Venda
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground w-full md:w-auto text-right space-y-1">
                                    <p>Coleta agendada para amanhã.</p>
                                    <div className="inline-flex items-center gap-2 text-[11px] px-2 py-1 bg-white/5 rounded-full">
                                        <Route className="h-3.5 w-3.5" /> Rota pronta (simulado)
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                ))}

                {matches.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Nenhuma nova oportunidade no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
