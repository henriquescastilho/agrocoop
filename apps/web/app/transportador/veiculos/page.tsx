"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SimpleModal } from "@/components/ui/simple-modal";
import { Truck, Snowflake, FileCheck2 } from "lucide-react";

type Vehicle = {
    name: string;
    phone: string;
    email: string;
    cnh: string;
    crlv: string;
    plate: string;
    type: string;
    capacity: string;
    refrigerated: boolean;
    region: string;
};

const STORAGE_KEY = "agrocoop:transportador-vehicle";

export default function TransportadorVeiculosPage() {
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Vehicle>({
        name: "",
        phone: "",
        email: "",
        cnh: "",
        crlv: "",
        plate: "",
        type: "",
        capacity: "",
        refrigerated: false,
        region: "",
    });
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Vehicle;
                setVehicle(parsed);
                setForm(parsed);
            } catch {
                // ignore
            }
        }
    }, []);

    const handleSave = () => {
        if (!form.name || !form.plate || !form.type) {
            setMessage("Preencha nome, placa e tipo do veículo.");
            window.alert("Dados salvos localmente.");
            return;
        }
        setVehicle(form);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        }
        setMessage("Veículo salvo localmente.");
        window.alert("Dados salvos localmente.");
        setOpen(false);
    };

    const docStatus = (label: string, value?: string) => (
        <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5 border border-white/10">
            <span>{label}</span>
            <Badge variant={value ? "success" : "secondary"} className="text-xs">{value ? "OK" : "Pendente"}</Badge>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Veículos & Documentos</h1>
                    <p className="text-muted-foreground">Cadastro rápido para roteirização. Persistência local.</p>
                </div>
                <Button className="bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={() => setOpen(true)}>
                    Cadastrar/Editar Veículo
                </Button>
            </div>

            {message && <p className="text-sm text-agro-sky">{message}</p>}

            <Card className="glass-panel border-white/10">
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Perfil do Veículo</CardTitle>
                        <CardDescription>Usado para sugerir cargas e rotas.</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white/5 text-xs flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5" /> Perfil local
                    </Badge>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Responsável</p>
                        <p className="font-semibold">{vehicle?.name || "Não cadastrado"}</p>
                        <p className="text-xs text-muted-foreground">{vehicle?.phone}</p>
                        <p className="text-xs text-muted-foreground">{vehicle?.email}</p>
                        <p className="text-sm mt-2">Região: {vehicle?.region || "—"}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="border-white/15">{vehicle?.type || "Tipo"}</Badge>
                            <span className="text-muted-foreground">Placa {vehicle?.plate || "—"}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Capacidade: {vehicle?.capacity || "—"} kg</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Snowflake className="h-4 w-4 text-cyan-400" />
                            {vehicle?.refrigerated ? "Refrigeração disponível" : "Sem refrigeração"}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <p className="text-sm font-medium flex items-center gap-2">
                            <FileCheck2 className="h-4 w-4" /> Checklist de Documentos
                        </p>
                        <div className="grid md:grid-cols-3 gap-2">
                            {docStatus("CNH", vehicle?.cnh)}
                            {docStatus("CRLV", vehicle?.crlv)}
                            {docStatus("Licenciamento", vehicle?.plate)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <SimpleModal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Cadastrar/Editar Veículo"
                description="Dados ficam salvos localmente."
            >
                <div className="space-y-3">
                    <div className="grid gap-2">
                        <Label>Nome / Razão Social</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Transportadora Amaral" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label>Telefone</Label>
                            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(21) 99999-9999" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contato@empresa.com" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label>CNH (condutor)</Label>
                            <Input value={form.cnh} onChange={(e) => setForm({ ...form, cnh: e.target.value })} placeholder="Registro CNH" />
                        </div>
                        <div className="grid gap-2">
                            <Label>CRLV</Label>
                            <Input value={form.crlv} onChange={(e) => setForm({ ...form, crlv: e.target.value })} placeholder="CRLV 2025" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label>Placa</Label>
                            <Input className="uppercase" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })} placeholder="ABC-1234" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tipo de Veículo</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                            >
                                <option value="">Selecionar...</option>
                                <option value="Caminhão">Caminhão</option>
                                <option value="Van">Van</option>
                                <option value="Fiorino">Fiorino</option>
                                <option value="VUC">VUC</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label>Capacidade (kg)</Label>
                            <Input value={form.capacity} type="number" onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="3500" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Região de atuação</Label>
                            <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Serrana, Baixada, Capital" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border border-white/10 rounded-lg bg-white/5 cursor-pointer" onClick={() => setForm({ ...form, refrigerated: !form.refrigerated })}>
                        <div className={`h-5 w-5 rounded border flex items-center justify-center ${form.refrigerated ? "bg-agro-sky border-agro-sky" : "border-muted-foreground"}`} />
                        <div className="flex items-center gap-2 text-sm">
                            <Snowflake className="h-4 w-4 text-cyan-400" />
                            <span>Possui refrigeração?</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button className="bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={handleSave}>
                            Salvar
                        </Button>
                    </div>
                </div>
            </SimpleModal>
        </div>
    );
}
