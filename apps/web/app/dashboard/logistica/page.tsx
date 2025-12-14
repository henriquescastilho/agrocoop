"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LogisticsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Logística & Rotas</h1>
                    <p className="text-muted-foreground">O mapa operacional agora vive no painel do transportador.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="warning">Somente consulta</Badge>
                </div>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-agro-sky" /> Acesso restrito ao transportador
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">Acesso restrito ao transportador</Badge>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>Para evitar confusão de papéis, o mapa de execução de rota só pode ser aberto pelo perfil de transportador.</p>
                    <p>Você ainda vê resumos e status, mas a navegação, confirmação e traçado ficam no painel dedicado.</p>
                    <Button asChild variant="outline" className="w-full md:w-auto">
                        <a href="/transportador/rotas">Ir para painel do transportador</a>
                    </Button>
                </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5" /> Histórico resumido
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Serra → Rio: economia R$ 380 • risco baixo</p>
                    <p>• Macacu → Niterói: economia R$ 220 • risco médio (chuva)</p>
                </CardContent>
            </Card>
        </div>
    );
}
