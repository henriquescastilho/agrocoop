"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Plus, Edit2, Trash2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiEnabled, createOffer, demoIds, fetchProducts } from "@/lib/api";

export default function ProducerPage() {
    const [products, setProducts] = useState<Array<{ id: number; name: string; volume: string; window: string; status: string }>>([]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // Load local mock data
        const stored = localStorage.getItem("agrocoop:producer-offers");
        if (stored) {
            try {
                setProducts(JSON.parse(stored));
                return;
            } catch {
                // ignore parse errors
            }
        }
        setProducts([
            { id: 1, name: "Tomate Italiano", volume: "500kg", window: "15/12 - 20/12", status: "Em Oferta" },
            { id: 2, name: "Alface Crespa", volume: "200 un", window: "Imediato", status: "Negociando" },
        ]);
        // optional: preload products to help user know the API is reachable
        if (apiEnabled) {
            fetchProducts().then((res) => {
                if (!res.ok) {
                    setMessage(`API indisponível para listar produtos: ${res.error}`);
                } else if (res.data.products.length === 0) {
                    setMessage("API conectada, mas não há produtos cadastrados. Cadastre no backend ou use mocks.");
                }
            });
        }
    }, []);

    const persist = (data: typeof products) => {
        setProducts(data);
        localStorage.setItem("agrocoop:producer-offers", JSON.stringify(data));
    };

    const handleAdd = () => {
        const newProduct = {
            id: products.length + 1,
            name: "Novo Produto",
            volume: "100kg",
            window: "A definir",
            status: "Rascunho",
        };
        const next = [...products, newProduct];
        persist(next);
        if (apiEnabled) {
            if (demoIds.producerUser && demoIds.product) {
                createOffer({
                    userId: demoIds.producerUser,
                    productId: demoIds.product,
                    qty: 100,
                    window: newProduct.window,
                }).then((res) => {
                    if (res.ok) {
                        setMessage("Produto salvo localmente e oferta enviada para API.");
                    } else {
                        setMessage(`Oferta salva localmente. Falha ao enviar para API: ${res.error} (verifique IDs demo e DB).`);
                    }
                });
            } else {
                setMessage("Produto salvo localmente. Configure NEXT_PUBLIC_DEMO_PRODUCER_ID e NEXT_PUBLIC_DEMO_PRODUCT_ID para enviar para API.");
            }
        } else {
            setMessage("Produto salvo localmente. Defina NEXT_PUBLIC_API_BASE_URL para sincronizar.");
        }
    };

    const handleSave = (id: number, status: string) => {
        const next = products.map((p) => (p.id === id ? { ...p, status } : p));
        persist(next);
        setMessage("Atualizado. Status sincronizado localmente (mock).");
    };

    const handleDelete = (id: number) => {
        const next = products.filter((p) => p.id !== id);
        persist(next);
        setMessage("Item removido. No backend real será um delete de oferta.");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Minha Produção</h1>
                    <p className="text-muted-foreground">Gerencie o que você vai colher e ofertar (persistência mockada).</p>
                </div>
                <Button onClick={handleAdd} className="bg-agro-green text-agro-dark hover:bg-agro-green/90">
                    <Plus className="mr-2 h-4 w-4" /> Novo Cultivo
                </Button>
            </div>

            {message && <p className="text-sm text-agro-sky">{message}</p>}

            <div className="grid gap-4">
                {products.map((product) => (
                    <Card key={product.id} className="glass-panel border-white/10 flex flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-agro-green/20 flex items-center justify-center">
                                <Sprout className="h-6 w-6 text-agro-green" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">Volume: {product.volume} • Janela: {product.window}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant={product.status === "Em Oferta" ? "success" : "secondary"}>
                                {product.status}
                            </Badge>
                            <Badge variant="warning">Mock</Badge>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleSave(product.id, "Em Oferta")}>
                                    <Save className="h-4 w-4 text-agro-green" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleSave(product.id, "Negociando")}>
                                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
