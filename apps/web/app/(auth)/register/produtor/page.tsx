"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, Sprout } from "lucide-react";
import { useRole } from "@/lib/use-role";
import { createUser } from "@/lib/api";

const PHONE_MASK_HINT = "(DDD + número com WhatsApp)";

export default function RegisterProducerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { setRole } = useRole("producer");
    const [name, setName] = useState("");
    const [whatsApp, setWhatsApp] = useState("");
    const [email, setEmail] = useState("");
    const [farmName, setFarmName] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [plantation, setPlantation] = useState("Tomate");
    const [otherPlantation, setOtherPlantation] = useState("");
    const [windowText, setWindowText] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        if (!whatsApp.trim()) {
            setMessage("Informe um número de WhatsApp válido.");
            setIsLoading(false);
            return;
        }

        const payload = {
            role: "producer" as const,
            name: name || "Produtor",
            phone: whatsApp,
            email: email || undefined,
        };

        const res = await createUser(payload);
        if (!res.ok) {
            setMessage(`Erro ao salvar: ${res.error}`);
            setIsLoading(false);
            return;
        }

        setRole("producer");
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
                    {/* Section 1: Identity */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase border-b border-white/10 pb-2">1. Seus Dados</h3>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" placeholder="Ex: João da Silva" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp (obrigatório)</Label>
                            <Input id="whatsapp" placeholder={PHONE_MASK_HINT} value={whatsApp} onChange={(e) => setWhatsApp(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail (opcional)</Label>
                            <Input id="email" type="email" placeholder="contato@sitio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                            <Input id="farm-name" placeholder="Ex: Sítio Esperança" value={farmName} onChange={(e) => setFarmName(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Cidade</Label>
                                <Input id="city" placeholder="Ex: Teresópolis" value={city} onChange={(e) => setCity(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">Estado</Label>
                                <Input id="state" placeholder="RJ" value={state} onChange={(e) => setState(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Production Capability */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase border-b border-white/10 pb-2">3. O que você planta?</h3>
                        <div className="space-y-2">
                            <Label htmlFor="plantation">Plantação principal</Label>
                            <select
                                id="plantation"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={plantation}
                                onChange={(e) => setPlantation(e.target.value)}
                            >
                                <option>Tomate</option>
                                <option>Verduras</option>
                                <option>Frutas</option>
                                <option>Raízes</option>
                                <option>Grãos</option>
                                <option>Outros</option>
                            </select>
                            {plantation === "Outros" && (
                                <Input placeholder="Descreva sua plantação" value={otherPlantation} onChange={(e) => setOtherPlantation(e.target.value)} required />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="window">Janela de colheita / volume</Label>
                            <Input id="window" placeholder="Ex: 15/10 a 20/10 • 500kg" value={windowText} onChange={(e) => setWindowText(e.target.value)} />
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
