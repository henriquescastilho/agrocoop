"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem("agrocoop:settings-note");
        if (stored) setSavedMessage(stored);
    }, []);

    const persistSettings = () => {
        const msg = "Preferências salvas localmente. Integrar com backend quando auth real estiver pronta.";
        setSavedMessage(msg);
        if (typeof window !== "undefined") window.localStorage.setItem("agrocoop:settings-note", msg);
    };

    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in zoom-in">
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-muted-foreground max-w-md">
                Ajuste suas preferências de notificação, perfil público e dados bancários.
            </p>
            <Badge variant="warning">Simulado / TODO backend</Badge>
            <Button variant="outline" onClick={persistSettings}>Salvar preferências locais</Button>
            {savedMessage && <p className="text-xs text-agro-sky max-w-md">{savedMessage}</p>}
        </div>
    );
}
