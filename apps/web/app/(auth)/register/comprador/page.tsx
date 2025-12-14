"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Building2 } from "lucide-react";

export default function RegisterBuyerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/dashboard");
    };

    return (
        <Card className="border-white/10 glass-panel w-full max-w-lg">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2 text-agro-sky">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-sm font-bold uppercase tracking-wider">Demanda Planejada</span>
                </div>
                <CardTitle className="text-2xl">Sou Comprador</CardTitle>
                <CardDescription>
                    Conecte-se diretamente à fonte, reduza custos e garanta abastecimento.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="space-y-6">

                    {/* Section 1: Business Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase border-b border-white/10 pb-2">1. Dados da Organização</h3>
                        <div className="space-y-2">
                            <Label htmlFor="company">Nome da Empresa / Órgão</Label>
                            <Input id="company" placeholder="Ex: Rede de Mercados Zona Sul" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo de Negócio</Label>
                            <div className="grid grid-cols-2 gap-2 text-sm text-center">
                                <div className="p-2 rounded border border-white/10 bg-white/5 hover:border-agro-sky/50 cursor-pointer">Mercado</div>
                                <div className="p-2 rounded border border-white/10 bg-white/5 hover:border-agro-sky/50 cursor-pointer">Escola</div>
                                <div className="p-2 rounded border border-white/10 bg-white/5 hover:border-agro-sky/50 cursor-pointer">Restaurante</div>
                                <div className="p-2 rounded border border-white/10 bg-white/5 hover:border-agro-sky/50 cursor-pointer">Indústria</div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Logistics Base */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase border-b border-white/10 pb-2">2. Base Logística</h3>
                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço de Recebimento (CD)</Label>
                            <Input id="address" placeholder="Av. Brasil, 1000 - Rio de Janeiro" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="volume">Volume Mensal (Est.)</Label>
                                <Input id="volume" placeholder="Ex: 5 Ton" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="frequency">Frequência</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option>Semanal</option>
                                    <option>Quinzenal</option>
                                    <option>Mensal</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button className="w-full bg-agro-sky text-sky-950 hover:bg-agro-sky/90 h-12 text-base font-semibold" type="submit" disabled={isLoading}>
                        {isLoading ? "Processando..." : "Criar Conta de Comprador"}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}
