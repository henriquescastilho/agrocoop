"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TransportadorConfigPage() {
    const [autoAssign, setAutoAssign] = useState(true);
    const [shareEta, setShareEta] = useState(true);

    const toast = () => window.alert("Preferência salva.");

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground">Preferências locais do painel do transportador.</p>
                </div>
            </div>

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg">Notificações</CardTitle>
                    <CardDescription>Clima, atrasos e disponibilidade.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Avisar sobre clima severo</p>
                            <p className="text-xs text-muted-foreground">Envio de alerta push e WhatsApp.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => { setAutoAssign(!autoAssign); toast(); }}>
                            {autoAssign ? "Ligado" : "Desligado"}
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Compartilhar ETA automático</p>
                            <p className="text-xs text-muted-foreground">Envia ETA para produtor e comprador.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => { setShareEta(!shareEta); toast(); }}>
                            {shareEta ? "Ligado" : "Desligado"}
                        </Button>
                    </div>
                    <Button variant="outline" onClick={toast}>Salvar preferências</Button>
                </CardContent>
            </Card>
        </div>
    );
}
