"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Building2, MapPin } from "lucide-react";
import { useRole } from "@/lib/use-role";
import { createUser } from "@/lib/api";

const PHONE_MASK_HINT = "(DDD + número com WhatsApp)";

export default function RegisterBuyerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { setRole } = useRole("buyer");

    // Form State
    const [businessType, setBusinessType] = useState("Mercado");
    const [otherDescription, setOtherDescription] = useState("");
    const [address, setAddress] = useState("");
    const [whatsApp, setWhatsApp] = useState("");
    const [email, setEmail] = useState("");
    const [contactName, setContactName] = useState("");

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setAddress(`Coordenadas: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("Erro ao obter localização. Verifique as permissões.");
                }
            );
        } else {
            alert("Geolocalização não suportada neste navegador.");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (businessType === "Outro" && !otherDescription.trim()) {
            setMessage("Por favor, descreva o seu tipo de negócio.");
            setIsLoading(false);
            return;
        }

        setMessage(null);

        if (!whatsApp.trim()) {
            setMessage("Informe um número de WhatsApp válido.");
            setIsLoading(false);
            return;
        }

        const payload = {
            role: "buyer" as const,
            name: contactName || "Comprador",
            phone: whatsApp,
            email: email || undefined,
            lat: undefined,
            lng: undefined,
        };

        const res = await createUser(payload);
        if (!res.ok) {
            setMessage(`Erro ao salvar: ${res.error}`);
            setIsLoading(false);
            return;
        }

        setRole("buyer");
        router.push("/comprador");
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
                            <Label htmlFor="contact">Responsável</Label>
                            <Input id="contact" placeholder="Nome do responsável" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp (obrigatório)</Label>
                            <Input id="whatsapp" placeholder={PHONE_MASK_HINT} value={whatsApp} onChange={(e) => setWhatsApp(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail (opcional)</Label>
                            <Input id="email" type="email" placeholder="contato@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Nome da Empresa / Órgão</Label>
                            <Input id="company" placeholder="Ex: Rede de Mercados Zona Sul" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo de Negócio</Label>
                            <div className="grid grid-cols-2 gap-2 text-sm text-center">
                                {["Mercado", "Escola", "Restaurante", "Indústria", "Outro"].map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setBusinessType(type)}
                                        className={`p-2 rounded border cursor-pointer transition-colors ${businessType === type
                                                ? "border-agro-sky bg-agro-sky/20 text-agro-sky font-bold"
                                                : "border-white/10 bg-white/5 hover:border-agro-sky/50"
                                            }`}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                            {businessType === "Outro" && (
                                <Input
                                    placeholder="Descreva seu tipo de negócio (Obrigatório)"
                                    value={otherDescription}
                                    onChange={(e) => setOtherDescription(e.target.value)}
                                    required
                                />
                            )}
                        </div>
                    </div>

                    {/* Section 2: Logistics Base */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase border-b border-white/10 pb-2">2. Base Logística</h3>

                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço de Recebimento (CD)</Label>
                            <Input
                                id="address"
                                placeholder="Rua, número, bairro, cidade"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-2">
                            <button type="button" onClick={handleGeolocation} className="btn-location w-full">
                                <span>
                                    <MapPin className="h-4 w-4" />
                                    USAR LOCALIZAÇÃO ATUAL (GPS)
                                </span>
                            </button>
                        </div>

                        {/* Removido Volume Mensal conforme pedido */}

                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frequência de Abastecimento</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>Semanal</option>
                                <option>Quinzenal</option>
                                <option>Mensal</option>
                            </select>
                        </div>

                    </div>

                    {/* Submit */}
                    <Button className="w-full bg-agro-sky text-sky-950 hover:bg-agro-sky/90 h-12 text-base font-semibold" type="submit" disabled={isLoading}>
                        {isLoading ? "Processando..." : "Criar Conta de Comprador"}
                    </Button>

                    {message && <p className="text-xs text-agro-sky">{message}</p>}

                </form>
            </CardContent>
        </Card>
    );
}
