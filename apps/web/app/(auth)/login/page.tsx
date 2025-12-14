"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Sprout, ShoppingCart, ShieldCheck } from "lucide-react";
import { useRole } from "@/lib/use-role";
import { LocationPicker } from "@/components/common/location-picker";

export default function LoginPage() {
    const router = useRouter();
    const { setRole } = useRole();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const handleLogin = async (e: React.FormEvent, role: "producer" | "buyer") => {
        e.preventDefault();
        setIsLoading(true);
        setRole(role);

        let msg = "Sessão iniciada. ";
        if (role === "producer") {
            if (location) {
                msg += "Localização validada com sucesso! ";
                // Here we would ideally send "location" to the backend to "validate with last location"
                // For MVP, we persist in localStorage for demonstration
                localStorage.setItem("agrocoop:last-login-location", JSON.stringify(location));
            } else {
                msg += "Aviso: Localização não verificada hoje. ";
            }
        }
        setMessage(msg + "Redirecionando...");

        await new Promise((resolve) => setTimeout(resolve, 800));
        router.push(role === "producer" ? "/dashboard" : "/comprador");
    };

    return (
        <Card className="border-white/10 glass-panel">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-agro-green/20 flex items-center justify-center">
                        <Sprout className="h-6 w-6 text-agro-green" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                    Acessar AgroCoop
                </CardTitle>
                <CardDescription className="text-center">
                    Autenticação real entra depois. Por enquanto definimos o role e abrimos o painel.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" placeholder="nome@exemplo.com" required type="email" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <button
                                type="button"
                                className="text-sm text-primary hover:underline"
                                onClick={() => setMessage("Recuperação de senha será feita via WhatsApp/Email. TODO: integrar endpoint real.")}
                            >
                                Esqueceu a senha?
                            </button>
                        </div>
                        <Input id="password" required type="password" />
                    </div>

                    <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-3 text-xs text-muted-foreground space-y-2">
                        <div className="flex items-start gap-2">
                            <ShieldCheck className="h-4 w-4 text-agro-sky mt-0.5" />
                            <span>Role é persistido em cookie/localStorage.</span>
                        </div>

                        {/* Location Module in Login as requested */}
                        <div className="pt-2 border-t border-white/10">
                            <Label className="text-[10px] uppercase text-agro-green font-bold mb-1 block">Validação de Localização (Produtor)</Label>
                            <LocationPicker
                                label="Validar Minha Localização Atual"
                                onLocationDetected={(lat, lng) => setLocation({ lat, lng })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            type="button"
                            className="w-full bg-agro-green hover:bg-agro-green/90 text-agro-dark font-bold h-12 text-base"
                            onClick={(e) => handleLogin(e, "producer")}
                            disabled={isLoading}
                        >
                            <Sprout className="mr-2 h-4 w-4" /> Entrar como Produtor
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-agro-sky text-agro-sky hover:bg-agro-sky/10 font-bold h-12 text-base"
                            onClick={(e) => handleLogin(e, "buyer")}
                            disabled={isLoading}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" /> Entrar como Comprador
                        </Button>
                    </div>

                    {message && <p className="text-xs text-agro-sky text-center animate-pulse">{message}</p>}
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                <div>
                    Não tem uma conta?{" "}
                    <Link href="/" className="text-primary hover:underline">
                        Cadastre-se
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
