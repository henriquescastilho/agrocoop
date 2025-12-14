"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-shim"; // Placeholder for shim
import { MapPin, Sprout, Truck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/use-role";

export default function RegisterProducerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { setRole } = useRole("producer");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setRole("producer");
        setMessage("Cadastro mockado. Role salvo em cookie/localStorage. Próximo: enviar para API.");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/dashboard");
    };

    return (
        <Card className="border-white/10 glass-panel w-full max-w-lg">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-agro-green">
                    <Sprout className="h-6 w-6" />
                    <span className="text-sm font-bold uppercase tracking-wider">Cadastro do Produtor</span>
                </div>
                <CardTitle className="text-2xl">Sou Agricultor</CardTitle>
                <CardDescription>
                    Cadastre o que você planta para receber ajuda no transporte e vendas justas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="space-y-6">
                    <Badge variant="warning">Simulado</Badge>

                    {/* Section 1: Identity */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase border-b border-white/10 pb-2">1. Seus Dados</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" placeholder="Ex: João da Silva" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doc">CPF</Label>
                                <Input id="doc" placeholder="000.000.000-00" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Celular ou E-mail</Label>
                            <Input id="email" type="text" placeholder="(21) 99999-9999" required />
                        </div>
                    </div>

                    {/* Section 2: Farm Location */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase border-b border-white/10 pb-2 flex items-center justify-between">
                            2. Seu Sítio / Fazenda
                            <span className="text-xs text-agro-sky flex items-center gap-1"><MapPin className="h-3 w-3" /> Localização Automática</span>
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="farm-name">Nome do Local</Label>
                            <Input id="farm-name" placeholder="Ex: Sítio Esperança" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Cidade</Label>
                                <Input id="city" placeholder="Ex: Teresópolis" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">Estado</Label>
                                <Input id="state" placeholder="RJ" required />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Production Capability */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase border-b border-white/10 pb-2">3. O que você planta?</h3>
                        <div className="space-y-2">
                            <Label>Marque o que você tem:</Label>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <label className="flex items-center gap-2 p-2 rounded border border-white/10 bg-white/5 cursor-pointer hover:border-agro-green/50">
                                    <input type="checkbox" className="accent-agro-green" /> Tomate
                                </label>
                                <label className="flex items-center gap-2 p-2 rounded border border-white/10 bg-white/5 cursor-pointer hover:border-agro-green/50">
                                    <input type="checkbox" className="accent-agro-green" /> Verduras
                                </label>
                                <label className="flex items-center gap-2 p-2 rounded border border-white/10 bg-white/5 cursor-pointer hover:border-agro-green/50">
                                    <input type="checkbox" className="accent-agro-green" /> Frutas
                                </label>
                                <label className="flex items-center gap-2 p-2 rounded border border-white/10 bg-white/5 cursor-pointer hover:border-agro-green/50">
                                    <input type="checkbox" className="accent-agro-green" /> Aipim/Batata
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button className="w-full bg-agro-green text-agro-dark hover:bg-agro-green/90 h-12 text-base font-semibold" type="submit" disabled={isLoading}>
                        {isLoading ? "Processando Cadastro..." : "Finalizar Cadastro"}
                    </Button>

                    {message && <p className="text-xs text-agro-sky">{message}</p>}

                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                    Ao se cadastrar, você concorda que o comprador será responsável pelo frete e logística.
                </p>
            </CardFooter>
        </Card>
    );
}
