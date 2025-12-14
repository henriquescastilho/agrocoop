"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, Snowflake, CheckCircle2 } from "lucide-react";
import { createUser } from "@/lib/api";
import { useRole } from "@/lib/use-role";

export default function RegisterTransportadorPage() {
    const router = useRouter();
    const { setRole } = useRole("transportador");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        whatsapp: "",
        email: "",
        phone: "",
        cnh: "",
        vehicleDoc: "",
        vehicleType: "",
        plate: "",
        capacity: "",
        refrigerated: false,
        regions: "",
    });

    const handleNext = () => {
        if (step === 1 && (!formData.name || !formData.whatsapp || !formData.cnh)) {
            alert("Preencha nome, WhatsApp e CNH.");
            return;
        }
        if (step === 2 && (!formData.vehicleDoc || !formData.vehicleType || !formData.plate)) {
            alert("Preencha documento do veículo, tipo e placa.");
            return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        const data = {
            ...formData,
            id: "transp-" + Date.now(),
            role: "transportador"
        };
        localStorage.setItem("agrocoop:transportador-profile", JSON.stringify(data));
        localStorage.setItem("agrocoop:user-role", "transportador");

        const res = await createUser({
            role: "transportador",
            name: formData.name || formData.company || "Transportador",
            phone: formData.whatsapp || formData.phone,
            email: formData.email || undefined,
        });
        if (!res.ok) {
            alert(`Erro ao registrar: ${res.error}`);
            return;
        }
        setRole("transportador");
        router.push("/transportador");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-lg glass-panel border-white/10">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-agro-sky/20 flex items-center justify-center">
                            <Truck className="h-6 w-6 text-agro-sky" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Cadastro de Parceiro Logístico</CardTitle>
                            <CardDescription>Junte-se à rede de transporte inteligente AgroCoop.</CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-agro-sky" : "bg-white/10"}`} />
                        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-agro-sky" : "bg-white/10"}`} />
                        <div className={`h-1 flex-1 rounded-full ${step >= 3 ? "bg-agro-sky" : "bg-white/10"}`} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dados Cadastrais</h3>
                            <div className="grid gap-2">
                                <Label>Nome Completo / Razão Social</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Expresso Agrícola Ltda"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>CPF / CNPJ</Label>
                                <Input
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="00.000.000/0001-00"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>WhatsApp (obrigatório)</Label>
                                <Input
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    placeholder="(21) 99999-9999"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email (opcional)</Label>
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contato@empresa.com"
                                />
                            </div>
                            <Button className="w-full bg-agro-sky text-white hover:bg-agro-sky/90" onClick={handleNext}>
                                Próximo: Veículo
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dados do Veículo</h3>
                            <div className="grid gap-2">
                                <Label>CNH do Condutor (Principal)</Label>
                                <Input
                                    value={formData.cnh}
                                    onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                                    placeholder="Registro CNH"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Documento do Veículo (CRLV ou Licenciamento)</Label>
                                <Input
                                    value={formData.vehicleDoc}
                                    onChange={(e) => setFormData({ ...formData, vehicleDoc: e.target.value })}
                                    placeholder="CRLV 2025"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Tipo de Veículo</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.vehicleType}
                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                    >
                                        <option value="">Selecionar...</option>
                                        <option value="VUC">VUC (Veículo Urbano de Carga)</option>
                                        <option value="Toco">Caminhão Toco</option>
                                        <option value="Truck">Caminhão Truck</option>
                                        <option value="Van">Van de Carga</option>
                                        <option value="Carreta">Carreta</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Placa</Label>
                                    <Input
                                        value={formData.plate}
                                        onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                        placeholder="ABC-1234"
                                        className="uppercase"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Capacidade de Carga (kg)</Label>
                                <Input
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    placeholder="Ex: 3500"
                                    type="number"
                                />
                            </div>
                            <div className="flex items-center gap-2 p-3 border border-white/10 rounded-lg bg-white/5 cursor-pointer" onClick={() => setFormData({ ...formData, refrigerated: !formData.refrigerated })}>
                                <div className={`h-5 w-5 rounded border flex items-center justify-center ${formData.refrigerated ? "bg-agro-sky border-agro-sky" : "border-muted-foreground"}`}>
                                    {formData.refrigerated && <CheckCircle2 className="h-3 w-3 text-white" />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Snowflake className="h-4 w-4 text-cyan-400" />
                                    <span className="text-sm">Possui Refrigeração?</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="w-1/2" onClick={() => setStep(1)}>Voltar</Button>
                                <Button className="w-1/2 bg-agro-sky text-white hover:bg-agro-sky/90" onClick={handleNext}>
                                    Próximo: Região
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Operação</h3>
                            <div className="grid gap-2">
                                <Label>Regiões de Atuação Preferencial</Label>
                                <Input
                                    value={formData.regions}
                                    onChange={(e) => setFormData({ ...formData, regions: e.target.value })}
                                    placeholder="Ex: Região Serrana RJ, Baixada, Capital"
                                />
                            </div>
                            <div className="p-4 bg-agro-green/10 border border-agro-green/20 rounded-lg">
                                <h4 className="font-semibold text-agro-green mb-1">Pronto para rodar!</h4>
                                <p className="text-xs text-muted-foreground">
                                    Ao confirmar, você terá acesso ao painel de rotas. O algoritmo da AgroCoop priorizará cargas que encaixem na sua capacidade e rota de retorno.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="w-1/2" onClick={() => setStep(2)}>Voltar</Button>
                                <Button className="w-1/2 bg-agro-green text-agro-dark hover:bg-agro-green/90" onClick={handleSubmit}>
                                    Finalizar Cadastro
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
