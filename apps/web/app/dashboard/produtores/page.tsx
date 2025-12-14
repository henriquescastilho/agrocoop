"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Plus, Edit2, Trash2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SimpleModal } from "@/components/ui/simple-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { apiEnabled, createOffer, demoIds, fetchProducts } from "@/lib/api";

export default function ProducerPage() {
    const [products, setProducts] = useState<Array<{ id: number; name: string; volume: string; window: string; status: string }>>([]);
    const [message, setMessage] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: "", volume: "", window: "", status: "Rascunho" });

    useEffect(() => {
        // ... (existing useEffect logic preserved)
        // Load local data
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
        if (apiEnabled) {
            fetchProducts().then((res) => {
                if (!res.ok) {
                    setMessage(`API indisponível para listar produtos: ${res.error}`);
                }
            });
        }
    }, [apiEnabled]);

    const persist = (data: typeof products) => {
        setProducts(data);
        localStorage.setItem("agrocoop:producer-offers", JSON.stringify(data));
    };

    const handleNew = () => {
        setEditingId(null);
        setFormData({ name: "", volume: "", window: "", status: "Rascunho" });
        setShowModal(true);
    };

    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setFormData({ name: product.name, volume: product.volume, window: product.window, status: product.status });
        setShowModal(true);
    };

    const handleSaveForm = () => {
        if (!formData.name || !formData.volume) {
            alert("Preencha nome e volume.");
            return;
        }

        let next;
        if (editingId) {
            next = products.map(p => p.id === editingId ? { ...p, ...formData } : p);
            setMessage("Cultivo atualizado com sucesso.");
        } else {
            const newProduct = {
                id: Date.now(), // simple unique id
                ...formData
            };
            next = [...products, newProduct];
            setMessage("Novo cultivo registrado.");
        }
        persist(next);
        setShowModal(false);
    };

    const handleSave = (id: number, status: string) => {
        const next = products.map((p) => (p.id === id ? { ...p, status } : p));
        persist(next);
        setMessage("Atualizado. Status salvo localmente.");
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
                    <p className="text-muted-foreground">Gerencie o que você vai colher e ofertar.</p>
                </div>
                <Button onClick={handleNew} className="bg-agro-green text-agro-dark hover:bg-agro-green/90">
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
                                <Button size="icon" variant="ghost" onClick={() => handleEdit(product)}>
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

            <SimpleModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingId ? "Editar Cultivo" : "Novo Cultivo"}
                description="Mantenha sua previsão de safra atualizada para logística eficiente."
            >
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Produto</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Tomate cereja"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Volume Estimado/Disponível</Label>
                        <Input
                            value={formData.volume}
                            onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                            placeholder="Ex: 2 toneladas"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Janela de Colheita</Label>
                        <Input
                            value={formData.window}
                            onChange={(e) => setFormData({ ...formData, window: e.target.value })}
                            placeholder="Ex: 10/01 a 20/01"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Rascunho">Rascunho</option>
                            <option value="Em Oferta">Em Oferta</option>
                            <option value="Negociando">Negociando</option>
                            <option value="Vendido">Vendido</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button className="bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={handleSaveForm}>
                            {editingId ? "Salvar Alterações" : "Cadastrar Cultivo"}
                        </Button>
                    </div>
                </div>
            </SimpleModal>
        </div>
    );
}
