import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { NewInvoiceEmail } from "@/components/emails/new-invoice";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: { client: true },
        });

        if (!invoice || !invoice.client || !invoice.client.email) {
            return NextResponse.json(
                { error: "Invoice not found or client has no email" },
                { status: 404 }
            );
        }

        // We need a payment URL. For this, we can either re-generate a Stripe/MercadoPago session 
        // or just send the link to the ERP payment page if you have one. 
        // Given the current architecture, let's assume we want to send the checkout URL.
        // I'll call the existing checkout logic or just use the metadata if available.

        // For now, let's generate a Stripe checkout URL as a default or assume the user wants 
        // to send them to the ERP dashboard where they can choose.
        // Actually, I'll create a session on the fly here to get a fresh URL.

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.includes("localhost")
            ? "https://erp.merali.com.br"
            : (process.env.NEXT_PUBLIC_APP_URL || "https://erp.merali.com.br");

        const finalPaymentUrl = `${baseUrl}/pay/${invoice.id}`;

        console.log(`[Email] Sending invoice to ${invoice.client.email} with link: ${finalPaymentUrl}`);

        const emailResult = await sendEmail({
            to: invoice.client.email,
            subject: `Fatura em Aberto - Merali Studio`,
            react: NewInvoiceEmail({
                clientName: invoice.client.name,
                amount: formatCurrency(invoice.amount),
                dueDate: format(new Date(invoice.dueDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
                paymentUrl: finalPaymentUrl,
            }),
        });

        if (!emailResult) {
            throw new Error("Resend failed to return success");
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("❌ Fatal Error in invoice send route:", error.message || error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
