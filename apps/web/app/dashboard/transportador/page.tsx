"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, ArrowRight } from "lucide-react";

export default function TransportadorDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Painel do Transportador</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Acesse o painel dedicado para rotas e execução.
                    </p>
                </div>
                <Badge variant="outline" className="bg-agro-green/10 text-agro-green border-agro-green/20">
                    Exclusivo do transportador
                </Badge>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle>Este atalho foi movido</CardTitle>
                    <CardDescription>Use o menu principal “Transportador” para abrir o mapa operacional.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="text-sm text-muted-foreground">O operador logístico controla rota e manifestos a partir do painel dedicado.</p>
                    <Button asChild className="bg-agro-sky text-sky-950 hover:bg-agro-sky/90">
                        <a href="/transportador">
                            Abrir painel <ArrowRight className="h-4 w-4 ml-2" />
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
