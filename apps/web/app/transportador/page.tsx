"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Route, Thermometer, Bell } from "lucide-react";

export default function TransportadorHome() {
    const kpis = useMemo(
        () => [
            { label: "Rotas ativas", value: "2", accent: "text-agro-green", icon: Route },
            { label: "Paradas hoje", value: "7", accent: "text-agro-sky", icon: Truck },
            { label: "% carga refrigerada", value: "45%", accent: "text-agro-earth", icon: Thermometer },
            { label: "Alertas clima", value: "1 leve", accent: "text-yellow-400", icon: Bell },
        ],
        [],
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Painel do Transportador</h1>
                    <p className="text-muted-foreground">Mapa operacional exclusivo para você executar coletas e entregas.</p>
                </div>
                <Button asChild className="bg-agro-sky text-sky-950 hover:bg-agro-sky/90">
                    <Link href="/transportador/rotas">Abrir Mapa de Rotas</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {kpis.map(({ label, value, accent, icon: Icon }) => (
                    <Card key={label} className="glass-panel border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                            <Icon className={`h-4 w-4 ${accent}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{value}</div>
                            <p className="text-xs text-muted-foreground">Dados locais até conectar telemetria.</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">Operação de Hoje</CardTitle>
                        <CardDescription>Resumo rápido das rotas consolidadas.</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white/5 text-xs">Atualização recente</Badge>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-white/10 p-4 bg-white/5">
                        <p className="text-sm text-muted-foreground">Rota Norte</p>
                        <p className="text-xl font-semibold">3 coletas • 1 entrega</p>
                        <p className="text-xs text-agro-green mt-1">Refrigeração ativa</p>
                    </div>
                    <div className="rounded-xl border border-white/10 p-4 bg-white/5">
                        <p className="text-sm text-muted-foreground">Rota Serra</p>
                        <p className="text-xl font-semibold">2 coletas • 1 entrega</p>
                        <p className="text-xs text-yellow-400 mt-1">Chuva prevista às 15h</p>
                    </div>
                    <div className="rounded-xl border border-white/10 p-4 bg-white/5">
                        <p className="text-sm text-muted-foreground">Próximo passo</p>
                        <p className="text-xl font-semibold">Descarregar CEASA</p>
                        <p className="text-xs text-muted-foreground mt-1">Motorista: Amaral • ETA 1h40</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
