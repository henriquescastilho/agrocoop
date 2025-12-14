import { jsPDF } from "jspdf";

export async function generateReport(date: string, userName: string) {
    const doc = new jsPDF();

    // Set Brand Colors
    const primaryColor = "#0D2B22"; // agro-dark
    const secondaryColor = "#2E5D4B"; // agro-green

    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AgroCoop", 20, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Relatório Operacional e Logístico", 20, 35);

    // Metadata
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 50);
    doc.text(`Usuário: ${userName}`, 20, 55);
    doc.text(`ID do Relatório: ${Date.now()}`, 150, 50);

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 60, 190, 60);

    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text("Resumo de Performance", 20, 75);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    const summaryData = [
        { label: "Oportunidades Recebidas", value: "12" },
        { label: "Negócios Fechados", value: "3" },
        { label: "Volume Total Movimentado", value: "4.5 Ton" },
        { label: "Economia Logística Estimada", value: "R$ 1.250,00" },
    ];

    let y = 90;
    summaryData.forEach(item => {
        doc.setFont("helvetica", "bold");
        doc.text(item.label + ":", 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(item.value, 80, y);
        y += 10;
    });

    // Alert Section (Mocked logic from dashboard)
    y += 10;
    doc.setFillColor(255, 240, 230); // Light orange background for alerts
    doc.roundedRect(20, y, 170, 30, 3, 3, "F");

    doc.setTextColor(200, 80, 0); // Orange text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Alertas Ativos", 25, y + 10);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("• Risco Climático: Previsão de chuvas fortes na Região Serrana (INMET).", 25, y + 20);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("AgroCoop - A Rede Viva. Documento gerado automaticamente.", 105, 280, { align: "center" });

    return doc;
}
