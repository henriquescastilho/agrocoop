import Link from "next/link";
import { Sprout, LayoutDashboard, Map, Package, Settings, LogOut, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 border-r border-white/10 bg-card/50 backdrop-blur-xl md:flex flex-col">
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-8 w-8 rounded-lg bg-agro-green/20 flex items-center justify-center">
                            <Sprout className="h-5 w-5 text-agro-green" />
                        </div>
                        <span>Agro<span className="text-agro-green">Coop</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5">
                            <LayoutDashboard className="h-4 w-4" />
                            Visão Geral
                        </Button>
                    </Link>
                    <Link href="/dashboard/produtores">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5">
                            <Sprout className="h-4 w-4" />
                            Minha Produção
                        </Button>
                    </Link>
                    <Link href="/dashboard/logistica">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5">
                            <Map className="h-4 w-4" />
                            Logística & Mapa
                        </Button>
                    </Link>
                    <Link href="/dashboard/pedidos">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5">
                            <Package className="h-4 w-4" />
                            Pedidos & Matches
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                        <Settings className="h-4 w-4" />
                        Configurações
                    </Button>
                    <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Mobile Header (Simplified) */}
                <header className="md:hidden h-16 border-b border-white/10 flex items-center px-4 justify-between bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Sprout className="text-agro-green h-5 w-5" /> AgroCoop
                    </div>
                    <Button size="icon" variant="ghost">
                        <PanelLeft className="h-5 w-5" />
                    </Button>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
