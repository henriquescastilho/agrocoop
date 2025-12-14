"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRole, UserRole } from "@/lib/use-role";
import { Sprout, ShoppingCart, MapPinned, CloudRain } from "lucide-react";

type Field = {
    label: string;
    placeholder?: string;
    helper?: string;
    required?: boolean;
};

const producerFields: Field[] = [
    { label: "Identidade produtiva", placeholder: "Sítio Esperança - Tomate Italiano", required: true },
    { label: "Localização (geolocalização)", placeholder: "Geo: clique para capturar", helper: "Usar coordenada real garante rota e clima corretos.", required: true },
    { label: "Produção e oferta", placeholder: "Produto, quantidade, janela de colheita", required: true },
    { label: "Pós-colheita e armazenamento", placeholder: "Refrigeração, packing, necessidades" },
    { label: "Logística disponível", placeholder: "Tem caminhão? Pode entregar? Horários" },
    { label: "Dificuldades atuais", placeholder: "Rotas difíceis, estrada, falta de caminhão" },
];

const buyerFields: Field[] = [
    { label: "Tipo de comprador", placeholder: "Escola pública / Restaurante / Distribuidor", required: true },
    { label: "Volume médio e frequência", placeholder: "Ex: 2 toneladas/semana", required: true },
    { label: "Produtos e janela de entrega", placeholder: "Produto, janela, base logística", required: true },
    { label: "Limite de preço e risco", placeholder: "Preço máximo, tolerância a risco logístico" },
    { label: "Logística (sempre sua)", placeholder: "Base, frota, restrições de rota", helper: "O comprador sempre paga o frete. Vamos otimizar." },
];

export default function RegisterRolePage() {
    const router = useRouter();
    const params = useParams();
    const slug = Array.isArray(params?.role) ? params.role[0] : params?.role;
    const role: UserRole = slug === "comprador" ? "buyer" : "producer";
    const icon = role === "producer" ? <Sprout className="h-5 w-5 text-agro-green" /> : <ShoppingCart className="h-5 w-5 text-agro-sky" />;
    const { setRole } = useRole(role);
    const [submitted, setSubmitted] = useState(false);

    const fields = useMemo(() => (role === "producer" ? producerFields : buyerFields), [role]);
    const title = role === "producer" ? "Cadastro do Agricultor" : "Cadastro do Comprador";
    const description = role === "producer"
        ? "Planejamento guiado para registrar oferta, janela e logística."
        : "Publicar demanda com rota e custo logístico sob seu controle.";

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitted(true);
        setRole(role);
        router.push(role === "producer" ? "/dashboard" : "/comprador");
    };

    return (
        <Card className="border-white/10 glass-panel">
            <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {icon}
                        <span>Role selecionada</span>
                    </div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.label} className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                {field.label}
                                {field.required && <span className="text-xs text-agro-earth">obrigatório</span>}
                            </label>
                            <Input placeholder={field.placeholder} required={field.required} />
                            {field.helper && <p className="text-xs text-muted-foreground">{field.helper}</p>}
                        </div>
                    ))}

                    <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPinned className="h-4 w-4" />
                        Geo + clima integrados: capturamos coordenadas para sugerir rota e janela base clima (INMET). Se estiver offline, guardaremos para sincronizar.
                    </div>

                    <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 flex items-center gap-3 text-sm text-muted-foreground">
                        <CloudRain className="h-4 w-4" />
                        Placeholder IA: explicações de risco, consolidação e reputação serão exibidas aqui. TODO: plugar motor real.
                    </div>

                    <Button type="submit" className="w-full bg-agro-green text-agro-dark hover:bg-agro-green/90">
                        {submitted ? "Enviando..." : "Salvar e entrar"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        Sem burocracia: salvamos dados localmente e no backend assim que a API real estiver ativa.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
