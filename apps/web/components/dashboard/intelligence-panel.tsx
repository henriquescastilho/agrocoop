import { AlertTriangle, Sparkles, CheckCircle2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { apiEnabled, fetchAIRecommendRoute } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

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



// ... InsightCard ...

export function IntelligencePanel() {
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!apiEnabled) {
            setAiInsight("IA não configurada. Defina GEMINI_API_KEY no backend.");
            setLoading(false);
            return;
        }
        // Mocking a route plan to ask for recommendation
        // In a real scenario, this would come from the context or props
        const mockRoutePlan = {
            stops: ["Produtor A", "Produtor B", "Comprador X"],
            totalDist: 120,
            cargoType: "Perecível (Tomate)"
        };

        fetchAIRecommendRoute(mockRoutePlan).then((res) => {
            if (res.ok) {
                setAiInsight(res.data.explanation);
            } else {
                setAiInsight("IA indisponível. Verifique GEMINI_API_KEY e API Base.");
            }
            setLoading(false);
        });
    }, []);

    return (
        <Card className="glass-panel border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Insights da Operação (Gemini AI)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Static/Mock Risk Card - keeping for stability as requested "mock com feedback" */}
                <InsightCard
                    type="risk"
                    title="Alerta de Logística"
                    explanation="Alta probabilidade de chuvas na rota da BR-116 nas próximas 4h. Recomenda-se antecipar coleta para evitar perda de 12% da carga de folhosas."
                    score={85}
                />

                {/* Dynamic AI Card */}
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-white/10" />
                        <Skeleton className="h-4 w-3/4 bg-white/10" />
                    </div>
                ) : (
                    <InsightCard
                        type="opportunity"
                        title="Recomendação de Rota (AI)"
                        explanation={aiInsight || "IA indisponível. Verifique a chave de API."}
                        score={92}
                    />
                )}
            </CardContent>
        </Card>
    )
}
