"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CheckCircle, MapPinned } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function BuyerOrdersPage() {
    const [message, setMessage] = useState<string | null>(null);
    const [routeStatus, setRouteStatus] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem("agrocoop:buyer-route");
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as { confirmed: boolean; message?: string };
                if (parsed.confirmed) setRouteStatus(parsed.message || "Rota confirmada");
            } catch {
                // ignore
            }
        }
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
            <p className="text-muted-foreground">Rastreamento em tempo real das suas entregas.</p>

            {message && <p className="text-sm text-agro-sky">{message}</p>}

            <div className="grid gap-4">
                <Card className="glass-panel border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-agro-sky/20 rounded-full flex items-center justify-center text-agro-sky">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Pedido #8821</h3>
                            <p className="text-sm text-muted-foreground">3 itens • R$ 450,00</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <Badge className="bg-agro-green text-agro-dark mb-2">{routeStatus ? "Rota Confirmada" : "Em Trânsito"}</Badge>
                        <p className="text-xs text-muted-foreground">{routeStatus || "Chegada estimada: 14:30"}</p>
                        <Link href="/comprador/rotas" className="text-xs text-agro-sky flex items-center gap-1 hover:underline" onClick={() => setMessage("Abrindo rota consolidada.")}>
                            <MapPinned className="h-3.5 w-3.5" /> Ver rota
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
