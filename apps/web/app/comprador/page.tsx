"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, TrendingDown, DollarSign, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiEnabled, fetchMeta } from "@/lib/api";
import { useEffect } from "react";

export default function BuyerDashboardPage() {
    const [message, setMessage] = useState<string | null>(null);
    const [counts, setCounts] = useState<{ offers: number; demands: number; matches: number } | null>(null);

    useEffect(() => {
        if (apiEnabled) {
            fetchMeta().then((res) => {
                if (res.ok) setCounts(res.data.counts);
            });
        }
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Visão Geral (Comprador)</h1>
                    <p className="text-muted-foreground">Acompanhe suas compras, logística e economia.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-agro-sky text-sky-950 hover:bg-agro-sky/90" onClick={() => setMessage("Demanda simulada criada. Próximo passo: POST /api/demands")}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Nova Compra
                    </Button>
                </div>
            </div>

            {message && <p className="text-sm text-agro-sky">{message}</p>}

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShoppingCart className="h-24 w-24 text-agro-sky" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Volume Comprado (Mês)</CardTitle>
                        <div className="text-3xl font-bold text-foreground mt-2">12.5 ton</div>
                        <p className="text-xs text-agro-green flex items-center mt-1">
                            <TrendingDown className="h-3 w-3 mr-1" /> +15% vs mês anterior
                        </p>
                        {counts && <p className="text-xs text-muted-foreground">Demandas ativas: {counts.demands} • Matches: {counts.matches}</p>}
                    </CardHeader>
                </Card>

                <Card className="glass-panel border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign className="h-24 w-24 text-agro-green" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Economia Logística</CardTitle>
                        <div className="text-3xl font-bold text-agro-green mt-2">R$ 5.400</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Graças à consolidação de carga
                        </p>
                    </CardHeader>
                </Card>

                <Card className="glass-panel border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Truck className="h-24 w-24 text-agro-earth" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Próxima Entrega</CardTitle>
                        <div className="text-3xl font-bold text-foreground mt-2">Hoje, 14:00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Caminhão #88 • 3 Produtores
                        </p>
                    </CardHeader>
                </Card>
            </div>

            {/* Map + Demands */}
            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg">Minhas Demandas</CardTitle>
                    <CardDescription>Últimos pedidos publicados.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                            <p className="font-semibold">Tomate Italiano • 2 ton</p>
                            <p className="text-xs text-muted-foreground">Entrega: 20-25/Out • Base: Jacarepaguá</p>
                        </div>
                        <Badge variant="success">Em negociação</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                            <p className="font-semibold">Alface Crespa • 800 un</p>
                            <p className="text-xs text-muted-foreground">Entrega: 18/Out • Base: Zona Sul</p>
                        </div>
                        <Badge variant="outline">Aguardando rota</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Rotas e execução ficam no painel do transportador.</p>
                </CardContent>
            </Card>

        </div>
    );
}
