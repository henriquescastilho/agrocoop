"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Store, Sprout, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { SimpleModal } from "@/components/ui/simple-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function MercadoPage() {
    const [message, setMessage] = useState<string | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<{ id: number; product: string; producer: string } | null>(null);
    const [bid, setBid] = useState("");

    const offers = [
        { id: 1, product: "Tomate Italiano", producer: "Sítio Vista Alegre", region: "Nova Friburgo", price: "R$ 4,50/kg", volume: "2 ton", quality: "Premium" },
        { id: 2, product: "Cenoura", producer: "Fazenda Sol Nascente", region: "Teresópolis", price: "R$ 2,20/kg", volume: "500 kg", quality: "Padrão" },
        { id: 3, product: "Alface Americana", producer: "Coop. Verde Vale", region: "Petrópolis", price: "R$ 1,80/un", volume: "1000 un", quality: "Orgânico" },
    ];

    const handleNegotiateClick = (offer: any) => {
        setSelectedOffer(offer);
        setBid("");
    }

    const confirmNegotiation = () => {
        if (!bid) {
            setMessage("Informe um valor para a proposta.");
            return;
        }
        setMessage(`Proposta de ${bid} enviada para ${selectedOffer?.producer}.`);
        setSelectedOffer(null);
    }

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
                            onClick={() => handleNegotiateClick(offer)}
                        >
                            Negociar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Card>
                ))}
            </div>

            <SimpleModal
                isOpen={!!selectedOffer}
                onClose={() => setSelectedOffer(null)}
                title={`Negociar ${selectedOffer?.product}`}
                description={`Enviar contraproposta para ${selectedOffer?.producer}`}
            >
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label className="text-zinc-700">Sua Oferta</Label>
                        <Input
                            placeholder="Ex: R$ 4,20/kg"
                            className="bg-white text-zinc-900 border-zinc-200 placeholder:text-zinc-400"
                            value={bid}
                            onChange={(e) => setBid(e.target.value)}
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setSelectedOffer(null)} className="text-zinc-700 border-zinc-200 hover:bg-zinc-50">Cancelar</Button>
                        <Button className="bg-agro-sky text-sky-950 hover:bg-agro-sky/90" onClick={confirmNegotiation}>Enviar Proposta</Button>
                    </div>
                </div>
            </SimpleModal>
        </div>
    );
}
