"use client";

import { AlertTriangle, Sparkles, CheckCircle2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InsightProps {
    type: "risk" | "opportunity" | "info";
    title: string;
    explanation: string;
    score?: number; // 0 to 100
}

export function InsightCard({ type, title, explanation, score }: InsightProps) {
    const isRisk = type === "risk";
    const isOpp = type === "opportunity";

    return (
        <div className={cn(
            "p-4 rounded-lg border backdrop-blur-sm transition-all",
            isRisk ? "bg-red-500/10 border-red-500/20 hover:border-red-500/40" : "",
            isOpp ? "bg-agro-green/10 border-agro-green/20 hover:border-agro-green/40" : "",
            type === "info" ? "bg-blue-500/10 border-blue-500/20" : ""
        )}>
            <div className="flex items-start gap-3">
                <div className={cn(
                    "p-2 rounded-full",
                    isRisk ? "bg-red-500/20 text-red-400" : "",
                    isOpp ? "bg-agro-green/20 text-agro-green" : "",
                    type === "info" ? "bg-blue-500/20 text-blue-400" : ""
                )}>
                    {isRisk && <AlertTriangle className="h-4 w-4" />}
                    {isOpp && <CheckCircle2 className="h-4 w-4" />}
                    {type === "info" && <Info className="h-4 w-4" />}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className={cn("font-semibold text-sm",
                            isRisk ? "text-red-400" : "",
                            isOpp ? "text-agro-green" : "",
                            type === "info" ? "text-blue-400" : ""
                        )}>
                            {title}
                        </h4>
                        {score !== undefined && (
                            <span className="text-xs font-mono opacity-70">
                                Score: {score}/100
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {explanation}
                    </p>

                    <div className="pt-2 flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" />
                        Análise via IA Generativa
                    </div>
                </div>
            </div>
        </div>
    );
}

export function IntelligencePanel() {
    return (
        <Card className="glass-panel border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Insights da Operação
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <InsightCard
                    type="risk"
                    title="Alerta de Logística"
                    explanation="Alta probabilidade de chuvas na rota da BR-116 nas próximas 4h. Recomenda-se antecipar coleta para evitar perda de 12% da carga de folhosas."
                    score={85}
                />
                <InsightCard
                    type="opportunity"
                    title="Consolidação Sugerida"
                    explanation="Há 3 produtores vizinhos com colheita de Tomate prevista para amanhã. Otimização de frete pode gerar economia de R$ 450,00."
                    score={92}
                />
            </CardContent>
        </Card>
    )
}
