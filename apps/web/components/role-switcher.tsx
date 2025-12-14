"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sprout, ShoppingCart, ShieldCheck } from "lucide-react";
import { useRole, UserRole } from "@/lib/use-role";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DEFAULT_ROUTE: Record<UserRole, string> = {
    producer: "/dashboard",
    buyer: "/comprador",
};

type Props = {
    className?: string;
    compact?: boolean;
};

export function RoleSwitcher({ className, compact }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { role, setRole, hydrated } = useRole();

    const activeRole = useMemo<UserRole>(() => {
        if (role === "buyer" || role === "producer") return role;
        // heuristic: infer by current route if not persisted yet
        if (pathname?.startsWith("/comprador")) return "buyer";
        return "producer";
    }, [pathname, role]);

    const switchTo = (next: UserRole) => {
        setRole(next);
        router.push(DEFAULT_ROUTE[next]);
    };

    return (
        <div className={cn("rounded-xl border border-white/10 bg-card/60 backdrop-blur-md p-3 shadow-lg flex flex-col gap-2", className)}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white/5 border-white/10">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Role ativo
                    </Badge>
                    <span className="text-sm text-muted-foreground">Persistido em cookie/localStorage (mock)</span>
                </div>
                {!compact && (
                    <Badge variant="warning" className="text-xs">
                        Simulado
                    </Badge>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant={activeRole === "producer" ? "agro" : "outline"}
                    className="w-full justify-center gap-2"
                    onClick={() => switchTo("producer")}
                    disabled={!hydrated && activeRole === "producer"}
                >
                    <Sprout className="h-4 w-4" />
                    Agricultor
                </Button>
                <Button
                    variant={activeRole === "buyer" ? "agro" : "outline"}
                    className="w-full justify-center gap-2"
                    onClick={() => switchTo("buyer")}
                    disabled={!hydrated && activeRole === "buyer"}
                >
                    <ShoppingCart className="h-4 w-4" />
                    Comprador
                </Button>
            </div>
            {!compact && (
                <p className="text-xs text-muted-foreground">
                    Este seletor define o fluxo exibido. Em produção será trocado por autenticação real.
                </p>
            )}
        </div>
    );
}
