"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Store, Sprout, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function MercadoPage() {
    const [message, setMessage] = useState<string | null>(null);
    const offers = [
        { id: 1, product: "Tomate Italiano", producer: "Sítio Vista Alegre", region: "Nova Friburgo", price: "R$ 4,50/kg", volume: "2 ton", quality: "Premium" },
        { id: 2, product: "Cenoura", producer: "Fazenda Sol Nascente", region: "Teresópolis", price: "R$ 2,20/kg", volume: "500 kg", quality: "Padrão" },
        { id: 3, product: "Alface Americana", producer: "Coop. Verde Vale", region: "Petrópolis", price: "R$ 1,80/un", volume: "1000 un", quality: "Orgânico" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mercado & Ofertas</h1>
                    <p className="text-muted-foreground">Conecte-se diretamente com produtores da região.</p>
                </div>
            </div>

            {message && <p className="text-sm text-agro-sky">{message}</p>}

            <div className="grid gap-4">
                {offers.map((offer) => (
                    <Card key={offer.id} className="glass-panel border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-agro-sky/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-agro-green/10 rounded-xl flex items-center justify-center group-hover:bg-agro-green/20 transition-colors">
                                <Sprout className="h-8 w-8 text-agro-green" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{offer.product}</h3>
                                <p className="text-sm text-muted-foreground">{offer.producer} • {offer.region}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Preço</p>
                                <p className="text-lg font-bold text-agro-earth">{offer.price}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Volume</p>
                                <p className="text-lg font-bold">{offer.volume}</p>
                            </div>
                            <Badge variant="outline" className="border-agro-green text-agro-green bg-agro-green/5">
                                {offer.quality}
                            </Badge>
                            </div>

                        <Button
                            className="bg-agro-sky text-sky-950 hover:bg-agro-sky/90"
                            onClick={() => setMessage(`Negociação iniciada (mock) com ${offer.producer} para ${offer.product}.`)}
                        >
                            Negociar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
