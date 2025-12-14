"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, ShoppingCart, ArrowRight, Truck, ShieldCheck, MapPinned } from "lucide-react";
import { useRole } from "@/lib/use-role";

export default function LandingPage() {
    const router = useRouter();
    const { setRole } = useRole();

    const goTo = (role: "producer" | "buyer" | "transportador") => {
        setRole(role);
        if (role === "transportador") {
            router.push("/register/transportador");
        } else {
            router.push(`/register/${role === "producer" ? "produtor" : "comprador"}`);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
                <div className="absolute top-[-25%] left-[-10%] w-[55%] h-[55%] bg-agro-green/15 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-25%] right-[-5%] w-[50%] h-[50%] bg-agro-sky/15 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(26,70,51,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(46,107,133,0.12),transparent_30%)]" />
            </div>

            <div className="z-10 w-full max-w-6xl flex flex-col items-center text-center space-y-10 animate-in fade-in zoom-in duration-700">

                {/* Header */}
                <div className="space-y-5">
                    <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full mb-2 shadow-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agro-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-agro-green"></span>
                        </span>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Infraestrutura logística • Explainable AI</span>
                    </div>

                    <div className="mb-2">
                        <div className="relative w-full h-32 md:h-40 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="AgroCoop Logo" className="h-full w-auto object-contain drop-shadow-2xl" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">Planejamento vivo de produção, compra e logística agrícola.</h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        AgroCoop é um sistema operacional de rota + safra: consolida coletas, antecipa risco climático e conecta produtor e comprador sem ruído.
                        Sem SaaS genérico. É infraestrutura.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-foreground">
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-agro-green" />
                            Frete pago pelo comprador, sempre.
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                            <MapPinned className="h-4 w-4 text-agro-sky" />
                            Mapa é o produto, não o acessório.
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                            <Truck className="h-4 w-4 text-agro-earth" />
                            Consolidação inteligente para menos viagens.
                        </div>
                    </div>
                </div>

                {/* Role Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2">

                    {/* Card: Produtor */}
                    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/10 to-white/0 hover:border-agro-green/50 transition-all duration-300 shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,175,80,0.08),transparent_40%)]" />
                        <CardHeader className="relative">
                            <div className="h-12 w-12 rounded-lg bg-agro-green/15 flex items-center justify-center mb-4 group-hover:bg-agro-green/25 transition-colors">
                                <Sprout className="h-6 w-6 text-agro-green" />
                            </div>
                            <CardTitle className="text-2xl">Sou Agricultor</CardTitle>
                            <CardDescription>
                                Planejo minha safra, registro oferta, aceito/recuso matches e vejo logística em tempo real.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative">
                            <Button onClick={() => goTo("producer")} className="w-full group-hover:bg-agro-green group-hover:text-agro-dark transition-all" variant="outline">
                                Entrar como Agricultor <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Card: Comprador */}
                    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/10 to-white/0 hover:border-agro-sky/50 transition-all duration-300 shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(46,107,133,0.10),transparent_45%)]" />
                        <CardHeader className="relative">
                            <div className="h-12 w-12 rounded-lg bg-agro-sky/15 flex items-center justify-center mb-4 group-hover:bg-agro-sky/25 transition-colors">
                                <ShoppingCart className="h-6 w-6 text-agro-sky" />
                            </div>
                            <CardTitle className="text-2xl">Sou Comprador</CardTitle>
                            <CardDescription>
                                Público, escola ou restaurante buscando previsibilidade, rota otimizada e custo logístico explicável.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative">
                            <Button onClick={() => goTo("buyer")} className="w-full group-hover:bg-agro-sky group-hover:text-sky-950 transition-all" variant="outline">
                                Entrar como Comprador <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Card: Transportador */}
                    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/10 to-white/0 hover:border-agro-earth/50 transition-all duration-300 shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(184,155,68,0.12),transparent_45%)]" />
                        <CardHeader className="relative">
                            <div className="h-12 w-12 rounded-lg bg-agro-earth/15 flex items-center justify-center mb-4 group-hover:bg-agro-earth/25 transition-colors">
                                <Truck className="h-6 w-6 text-agro-earth" />
                            </div>
                            <CardTitle className="text-2xl">Sou Transportador</CardTitle>
                            <CardDescription>
                                Opero rotas, manifesto e comunicação em tempo real com produtores e compradores.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative">
                            <Button onClick={() => goTo("transportador")} className="w-full group-hover:bg-agro-earth group-hover:text-agro-dark transition-all" variant="outline">
                                Entrar como Transportador <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer / Login Link */}
                <div className="mt-4 text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-foreground hover:text-agro-green underline underline-offset-4 transition-colors">
                        Fazer Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
