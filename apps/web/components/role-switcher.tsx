"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sprout, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { useRole, UserRole } from "@/lib/use-role";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DEFAULT_ROUTE: Record<UserRole, string> = {
    producer: "/dashboard",
    buyer: "/comprador",
    transportador: "/transportador",
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
        if (role === "buyer" || role === "producer" || role === "transportador") return role;
        // heuristic: infer by current route if not persisted yet
        if (pathname?.startsWith("/comprador")) return "buyer";
        if (pathname?.startsWith("/transportador")) return "transportador";
        return "producer";
    }, [pathname, role]);

    const switchTo = (next: UserRole) => {
        setRole(next);
        router.push(DEFAULT_ROUTE[next]);
    };

    return (
        <div className={cn("rounded-xl border border-white/10 bg-card/60 backdrop-blur-md p-3 shadow-lg flex flex-col gap-2", className)}>
            {!compact && (
                <Badge variant="warning" className="text-xs">
                    Simulação de Perfil
                </Badge>
            )}

            <div className="grid grid-cols-3 gap-2">
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
                <Button
                    variant={activeRole === "transportador" ? "agro" : "outline"}
                    className="w-full justify-center gap-2"
                    onClick={() => switchTo("transportador")}
                    disabled={!hydrated && activeRole === "transportador"}
                >
                    <Truck className="h-4 w-4" />
                    Transportador
                </Button>
            </div>
            {
                !compact && (
                    <p className="text-xs text-muted-foreground">
                        Este seletor define o fluxo exibido. Em produção será trocado por autenticação real.
                    </p>
                )
            }
        </div >
    );
}
