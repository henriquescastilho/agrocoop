"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Play, Truck, Navigation } from "lucide-react";

type StopStatus = "pendente" | "em_andamento" | "coletado" | "entregue";
type Stop = { id: string; label: string; eta: string; status: StopStatus; note: string };

const STORAGE_KEY = "agrocoop:transportador-stops";

const defaultStops: Stop[] = [
    { id: "1", label: "Sítio Vista Alegre", eta: "08:30", status: "pendente", note: "Folhosas • refrigeração leve" },
    { id: "2", label: "Fazenda Sol Nascente", eta: "09:15", status: "pendente", note: "Raízes • sem refrigeração" },
    { id: "3", label: "CEASA Rio", eta: "11:00", status: "pendente", note: "Entrega final" },
];

export default function TransportadorEntregasPage() {
    const [stops, setStops] = useState<Stop[]>(defaultStops);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setStops(JSON.parse(stored));
            } catch {
                setStops(defaultStops);
            }
        }
    }, []);

    const persist = (next: Stop[]) => {
        setStops(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
    };

    const handleUpdate = (id: string, status: StopStatus, toast: string) => {
        const next = stops.map((s) => (s.id === id ? { ...s, status } : s));
        persist(next);
        setMessage(toast);
        window.alert("Ação registrada. Sincronização automática em breve.");
    };

    const statusBadge = (status: StopStatus) => {
        if (status === "entregue") return <Badge variant="success">Entregue</Badge>;
        if (status === "coletado") return <Badge variant="outline">Coletado</Badge>;
        if (status === "em_andamento") return <Badge variant="warning">Em andamento</Badge>;
        return <Badge variant="secondary">Pendente</Badge>;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Entregas do Dia</h1>
                    <p className="text-muted-foreground">Controle rápido de coletas e entregas. Persistência local.</p>
                </div>
                <Badge variant="outline" className="bg-white/5 text-xs">Operação local</Badge>
            </div>

            {message && <p className="text-sm text-agro-sky">{message}</p>}

            <Card className="glass-panel border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg">Sequência planejada</CardTitle>
                    <CardDescription>Atualize o status de cada parada.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                    {stops.map((stop) => (
                        <div key={stop.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-9 w-9 rounded-full bg-agro-sky/10 flex items-center justify-center text-agro-sky">
                                        {stop.id === "3" ? <Navigation className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{stop.label}</p>
                                        <p className="text-xs text-muted-foreground">{stop.note}</p>
                                    </div>
                                </div>
                                {statusBadge(stop.status)}
                            </div>
                            <div className="text-xs text-muted-foreground">ETA {stop.eta}</div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleUpdate(stop.id, "em_andamento", "Rota iniciada.")}>
                                    <Play className="h-4 w-4 mr-2" /> Iniciar
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleUpdate(stop.id, "coletado", "Coleta registrada.")}>
                                    <Check className="h-4 w-4 mr-2" /> Coletado
                                </Button>
                                <Button size="sm" className="flex-1 bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={() => handleUpdate(stop.id, "entregue", "Entrega confirmada.")}>
                                    <Check className="h-4 w-4 mr-2" /> Entregue
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
