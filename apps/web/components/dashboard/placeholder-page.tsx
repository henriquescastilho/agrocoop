import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in zoom-in-50 duration-500">
            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Construction className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Esta funcionalidade está planejada e será ativada em breve.
                </p>
            </div>
            <Link href="/dashboard">
                <Button variant="outline">Voltar para Visão Geral</Button>
            </Link>
        </div>
    );
}
