import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/dashboard/map-view";
import { IntelligencePanel } from "@/components/dashboard/intelligence-panel";
import { ArrowUpRight, Truck, Thermometer, Calendar, Map, Sprout } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
                    <p className="text-muted-foreground">Bem-vindo(a). Sua logística está otimizada para a safra atual.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Baixar Relatório</Button>
                    <Button className="bg-agro-green text-agro-dark hover:bg-agro-green/90">Nova Operação</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-panel border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Economia Gerada</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-agro-green" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 12.450</div>
                        <p className="text-xs text-muted-foreground">+18% vs mês anterior</p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entregas em Rota</CardTitle>
                        <Truck className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">3 chegando ao destino</p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clima (INMET)</CardTitle>
                        <Thermometer className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">28°C</div>
                        <p className="text-xs text-muted-foreground">Chuva prevista em 2h</p>
                    </CardContent>
                </Card>
                <Card className="glass-panel border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Próxima Safra</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15/Out</div>
                        <p className="text-xs text-muted-foreground">Tomate (Região Serrana)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Map Integration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Map className="h-5 w-5 text-agro-green" /> Monitoramento Logístico
                    </h2>
                    <IntelligencePanel />
                    <MapView
                        markers={[{ lat: -22, lng: -43, type: 'producer', id: '1' }]}
                        selectedMatchId={null}
                    />
                </div>

                {/* Matches Column */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-agro-green" /> Oportunidades (Matches)
                    </h2>
                    <div className="space-y-3">

                        {/* Match Card 1 */}
                        <Card className="hover:border-agro-green/50 transition-colors cursor-pointer glass-panel">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="success">98% Match</Badge>
                                    <span className="text-xs text-muted-foreground">há 10 min</span>
                                </div>
                                <h3 className="font-bold text-lg">Tomate Italiano Selecionado</h3>
                                <p className="text-sm text-muted-foreground mb-3">Fazenda Santa Luzia • 45km</p>

                                <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded border border-white/5 mb-3">
                                    <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Frete Compartilhado</span>
                                    <span className="font-bold text-agro-green">R$ 4,50/kg</span>
                                </div>

                                <Button size="sm" className="w-full bg-white/10 hover:bg-white/20">Ver Detalhes</Button>
                            </CardContent>
                        </Card>

                        {/* Match Card 2 */}
                        <Card className="hover:border-agro-green/50 transition-colors cursor-pointer glass-panel border-white/5 bg-transparent">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="warning">Risco Médio</Badge>
                                    <span className="text-xs text-muted-foreground">há 1h</span>
                                </div>
                                <h3 className="font-bold text-lg">Batata Inglesa</h3>
                                <p className="text-sm text-muted-foreground mb-3">Sítio dos Irmãos • 120km</p>

                                <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded border border-white/5 mb-3">
                                    <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> Requer Refrig.</span>
                                    <span className="font-bold text-agro-green">R$ 2,10/kg</span>
                                </div>

                                <Button size="sm" className="w-full bg-white/10 hover:bg-white/20">Ver Detalhes</Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>

        </div>
    );
}
