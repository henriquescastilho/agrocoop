"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Map, ClipboardList, Truck, Settings, LogOut, PanelLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleSwitcher } from "@/components/role-switcher";
import { useRole } from "@/lib/use-role";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/transportador", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/transportador/rotas", label: "Logística & Rotas", icon: Map },
    { href: "/transportador/entregas", label: "Entregas do Dia", icon: ClipboardList },
    { href: "/transportador/veiculos", label: "Veículos & Documentos", icon: Truck },
    { href: "/transportador/config", label: "Configurações", icon: Settings },
];

export default function TransportadorLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { role, setRole, hydrated } = useRole("transportador");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!hydrated) return;
        if (role === "producer") {
            router.replace("/dashboard");
        } else if (role === "buyer") {
            router.replace("/comprador");
        }
    }, [hydrated, role, router]);

    const activePath = useMemo(() => pathname ?? "", [pathname]);

    const NavLinks = () => (
        <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = activePath === item.href;
                return (
                    <Link href={item.href} key={item.href}>
                        <Button
                            variant={active ? "agro" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-white/5",
                                active && "text-agro-dark",
                            )}
                            onClick={() => setMobileOpen(false)}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Button>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-72 border-r border-white/10 bg-card/50 backdrop-blur-xl md:flex flex-col">
                <div className="p-6 space-y-4">
                    <Link href="/transportador" className="flex items-center gap-2 font-bold text-xl justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="AgroCoop" className="h-12 w-auto object-contain" />
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                        <Shield className="h-3.5 w-3.5 text-agro-sky" />
                        Operação do Transportador
                    </div>
                    <RoleSwitcher compact />
                </div>

                <NavLinks />

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                            setRole("producer");
                            router.push("/login");
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-72 bg-card border-r border-white/10 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <RoleSwitcher />
                        <NavLinks />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-white/10 flex items-center px-4 justify-between bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                    <Link href="/transportador" className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="AgroCoop" className="h-8 w-auto object-contain" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">Transportador</Badge>
                        <Button size="icon" variant="ghost" onClick={() => setMobileOpen((open) => !open)}>
                            <PanelLeft className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
