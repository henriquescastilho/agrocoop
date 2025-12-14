"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PanelsTopLeft, Navigation, Route } from "lucide-react";

export default function BuyerRoutesPage() {
    const stops = [
        { id: "s1", label: "Produtor - Serra", eta: "08:10", note: "Carregar 1.2 ton" },
        { id: "s2", label: "Produtor - Teresópolis", eta: "09:00", note: "Carregar 0.8 ton" },
        { id: "b1", label: "Base Comprador - Rio", eta: "11:40", note: "Recepção + inspeção" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rotas & Consolidação</h1>
                    <p className="text-muted-foreground">Monitoramento de rota é operado pelo transportador. Aqui você vê apenas o plano.</p>
                </div>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PanelsTopLeft className="h-5 w-5 text-agro-sky" /> Plano de Rota
                    </CardTitle>
                    <CardDescription>Resumo das paradas e ordem planejada.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {stops.map((step, idx) => (
                        <div key={step.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-agro-sky/15 flex items-center justify-center">
                                    <Navigation className="h-5 w-5 text-agro-sky" />
                                </div>
                                <div>
                                    <p className="font-semibold">{step.label}</p>
                                    <p className="text-xs text-muted-foreground">{step.note}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Parada #{idx + 1}</p>
                                <p className="text-sm font-medium">{step.eta}</p>
                            </div>
                        </div>
                    ))}
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Route className="h-4 w-4 text-agro-earth" /> Execução em tempo real disponível apenas no painel do transportador.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
