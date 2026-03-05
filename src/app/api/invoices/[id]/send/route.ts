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

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://erp.merali.com.br";
        const paymentUrl = `${baseUrl}/pay/${invoice.id}`; // If you have a public pay page, otherwise use checkout API directly

        // Alternative: Let's use the actual checkout API internally
        const { data: checkoutData } = await (await fetch(`${baseUrl}/api/invoices/${id}/checkout`, {
            method: "POST",
            body: JSON.stringify({ gateway: "stripe" }), // Default to stripe for the email link
            headers: { "Content-Type": "application/json" }
        })).json();

        const finalPaymentUrl = checkoutData?.url || paymentUrl;

        await sendEmail({
            to: invoice.client.email,
            subject: `Fatura em Aberto - Merali Studio`,
            react: NewInvoiceEmail({
                clientName: invoice.client.name,
                amount: formatCurrency(invoice.amount),
                dueDate: format(new Date(invoice.dueDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
                paymentUrl: finalPaymentUrl,
            }),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending invoice email:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
