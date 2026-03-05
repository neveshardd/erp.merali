import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import { PaymentReceivedEmail } from "@/components/emails/payment-received";
import { NewInvoiceEmail } from "@/components/emails/new-invoice";
import { BudgetApprovedEmail } from "@/components/emails/budget-approved";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get("to") || "contato@merali.com.br";
    const type = searchParams.get("type") || "payment";

    try {
        let subject = "Teste de Email - Merali Studio";
        let react;

        if (type === "payment") {
            subject = "Pagamento Confirmado - Merali Studio";
            react = PaymentReceivedEmail({
                clientName: "Cliente Teste",
                amount: "R$ 5.500,00",
                invoiceId: "test_invoice_id",
            });
        } else if (type === "invoice") {
            subject = "Nova Fatura - Merali Studio";
            react = NewInvoiceEmail({
                clientName: "Cliente Teste",
                amount: "R$ 5.500,00",
                dueDate: "15 de Março de 2026",
                paymentUrl: "https://merali.com.br",
            });
        } else if (type === "approved") {
            subject = "Projeto Aprovado! - Merali Studio";
            react = BudgetApprovedEmail({
                clientName: "Cliente Teste",
                projectName: "Casa do Lago",
            });
        }

        const data = await sendEmail({ to, subject, react: react as any });
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
