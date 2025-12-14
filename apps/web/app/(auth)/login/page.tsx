"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Sprout } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For MVP demo, redirect to dashboard regardless of input
        router.push("/dashboard");
    };

    return (
        <Card className="border-white/10 glass-panel">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-agro-green/20 flex items-center justify-center">
                        <Sprout className="h-6 w-6 text-agro-green" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-center">Acessar AgroCoop</CardTitle>
                <CardDescription className="text-center">
                    Entre com seu e-mail e senha
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" placeholder="nome@exemplo.com" required type="email" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <Link href="#" className="text-sm text-primary hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <Input id="password" required type="password" />
                    </div>
                    <Button className="w-full bg-agro-green text-agro-dark hover:bg-agro-green/90" type="submit" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
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
