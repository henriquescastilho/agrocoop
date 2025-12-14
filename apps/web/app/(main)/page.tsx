import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, ShoppingCart, ArrowRight, Truck } from "lucide-react";

export default function LandingPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-agro-green/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-agro-sky/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-5xl flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">

                {/* Header */}
                <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agro-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-agro-green"></span>
                        </span>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Sistema Operacional</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground font-display">
                        Agro<span className="text-agro-green">Coop</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Não é um marketplace. É uma infraestrutura de <span className="text-foreground font-semibold">inteligência preditiva</span> que elimina desperdício e conecta quem produz a quem compra.
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-12">

                    {/* Card: Produtor */}
                    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/0 hover:border-agro-green/50 transition-all duration-300">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-agro-green/10 flex items-center justify-center mb-4 group-hover:bg-agro-green/20 transition-colors">
                                <Sprout className="h-6 w-6 text-agro-green" />
                            </div>
                            <CardTitle className="text-2xl">Sou Agricultor</CardTitle>
                            <CardDescription>
                                Planejo minha safra, registro minha oferta e garanto venda sem desperdício.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/register/produtor">
                                <Button className="w-full group-hover:bg-agro-green group-hover:text-agro-dark transition-all" variant="outline">
                                    Acessar Plataforma <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Card: Comprador */}
                    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/0 hover:border-agro-sky/50 transition-all duration-300">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-agro-sky/10 flex items-center justify-center mb-4 group-hover:bg-agro-sky/20 transition-colors">
                                <ShoppingCart className="h-6 w-6 text-agro-sky" />
                            </div>
                            <CardTitle className="text-2xl">Sou Comprador</CardTitle>
                            <CardDescription>
                                Escolas, mercados e restaurantes buscando previsibilidade e logística eficiente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/register/comprador">
                                <Button className="w-full group-hover:bg-agro-sky group-hover:text-sky-950 transition-all" variant="outline">
                                    Buscar Produtos <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer / Login Link */}
                <div className="mt-12 text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-foreground hover:text-agro-green underline underline-offset-4 transition-colors">
                        Fazer Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
