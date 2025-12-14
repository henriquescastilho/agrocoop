"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ShoppingBag, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiEnabled, createDemand, ensureMockProducts, ensureMockUser, fetchProducts } from "@/lib/api";

// Mock Harvest Data
const HARVEST_CALENDAR: Record<string, string> = {
    "tomate": "Melhor época: Junho a Outubro (Safra de Inverno)",
    "alface": "Disponível o ano todo, melhor qualidade no Inverno",
    "cenoura": "Safra principal: Julho a Janeiro",
    "batata": "Safra das águas: Nov-Jan | Safra da seca: Mai-Ago",
    "morango": "Safra: Junho a Agosto (Alta procura!)"
};

export default function NewOrderPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<{ id: string; name: string; unit: string }[]>([]);
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            if (apiEnabled) {
                const res = await fetchProducts();
                if (res.ok && res.data.products.length > 0) {
                    setProducts(res.data.products);
                    setProductId(res.data.products[0].id);
                    return;
                }
            }
            const fallback = ensureMockProducts();
            setProducts(fallback);
            setProductId(fallback[0]?.id ?? "");
        };
        loadProducts();
    }, []);

    const selectedProduct = products.find((p) => p.id === productId);
    const harvestTip = selectedProduct ? HARVEST_CALENDAR[selectedProduct.name.toLowerCase()] : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!productId) {
                setError("Selecione um produto válido.");
                setIsLoading(false);
                return;
            }
            const buyer = ensureMockUser("buyer");
            const payload = {
                userId: buyer.id,
                productId,
                qty: Number(quantity),
                window: date,
            };

            const res = await createDemand(payload);

            if (res.ok) {
                setMessage("Pedido criado com sucesso! Rota será otimizada.");
            } else {
                setError(`API falhou: ${res.error}`);
                setMessage("Persistência local ativada.");
            }

            if (typeof window !== "undefined") {
                const local = window.localStorage.getItem("agrocoop:buyer-demands");
                const parsed = local ? JSON.parse(local) : [];
                parsed.push({ ...payload, productName: selectedProduct?.name, createdAt: new Date().toISOString() });
                window.localStorage.setItem("agrocoop:buyer-demands", JSON.stringify(parsed));
            }

            setTimeout(() => router.push("/comprador/pedidos"), 1200);
        } catch (error) {
            console.error(error);
            setMessage("Erro ao criar pedido. Tente novamente.");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex bg-agro-dark min-h-screen text-white">
            <main className="flex-1 p-2 md:p-6 overflow-auto flex items-center justify-center">
                <Card className="max-w-xl w-full glass-panel border-white/10">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2 text-agro-green">
                            <ShoppingBag className="h-6 w-6" />
                            <span className="text-sm font-bold uppercase tracking-wider">Nova Demanda</span>
                        </div>
                        <CardTitle className="text-2xl">O que você precisa comprar?</CardTitle>
                        <CardDescription>
                            A AgroCoop encontrará os produtores mais próximos e com melhor qualidade.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <Label>Produto</Label>
                                <Select onValueChange={setProductId} value={productId} required>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Selecione o alimento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* AI Recommendation Badge - Requested Feature */}
                            {harvestTip && (
                                <div className="p-3 rounded-lg bg-agro-sky/10 border border-agro-sky/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                    <Sparkles className="h-5 w-5 text-agro-earth shrink-0" />
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold text-agro-earth">Recomendação de Safra (IA)</h4>
                                        <p className="text-sm text-muted-foreground">{harvestTip}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="qty">Quantidade (Kg)</Label>
                                    <Input
                                        id="qty"
                                        type="number"
                                        placeholder="Ex: 50"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="bg-white/5 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Data Ideal</Label>
                                    <div className="relative">
                                        <Input
                                            id="date"
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="bg-white/5 border-white/10 pl-10"
                                            required
                                        />
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-agro-green hover:bg-agro-green/90 text-white h-12 text-lg font-semibold shadow-[0_0_20px_rgba(76,175,80,0.3)] transition-all hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Publicar Demanda"}
                                {!isLoading && " 🚀"}
                            </Button>

                            {error && <p className="text-center text-sm text-red-400">{error}</p>}
                            {message && (
                                <p className={`text-center text-sm ${message.includes("Erro") ? "text-red-400" : "text-agro-green"}`}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    )
}
