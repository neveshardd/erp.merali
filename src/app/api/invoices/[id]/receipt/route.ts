import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
// @ts-expect-error
import extenso from "extenso";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id") || "";

    let invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        budget: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Fatura não encontrada" },
        { status: 404 },
      );
    }

    // ── Self-Healing: Verificação manual se o webhook falhou ─────────────
    // Se temos um sessionId e a fatura ainda não consta como paga, checamos no Stripe
    if (sessionId && invoice.status !== "PAID") {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          invoice = await prisma.invoice.update({
            where: { id },
            data: {
              status: "PAID",
              paidAt: new Date(),
              stripeId: session.id,
              paymentMethod:
                session.payment_method_types?.[0] === "card"
                  ? "STRIPE_CARD"
                  : "STRIPE_BOLETO",
            },
            include: { client: true, budget: true },
          });
          console.log(
            `✅ [Self-Healing] Fatura ${id} confirmada manualmente via session_id`,
          );
        }
      } catch (e) {
        console.error("[STRIPE_RECOVER_ERROR]", e);
      }
    }

    const amount = invoice.amount ?? 0;
    const valueFormatted = amount.toFixed(2).replace(".", ",");
    const amountInWords = extenso(valueFormatted, { mode: "currency" });

    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });
    const paidAtFormatted = invoice.updatedAt
      ? format(new Date(invoice.updatedAt), "dd 'de' MMMM, yyyy", {
          locale: ptBR,
        })
      : dateFormatted;

    const number = `REC-${format(new Date(), "yyyyMMdd")}-${id.slice(-4).toUpperCase()}`;

    const projectName = invoice.budget?.projectName ?? "";
    const description = projectName
      ? `referente ao pagamento via Stripe da fatura #${id.slice(-6).toUpperCase()} relativa ao projeto '${projectName}'.`
      : `referente ao pagamento via Stripe da fatura #${id.slice(-6).toUpperCase()}.`;

    return NextResponse.json({
      invoiceId: id,
      number,
      date: dateFormatted,
      paidAt: paidAtFormatted,
      value: amount,
      amountInWords,
      sessionId,
      projectName,
      description,
      payer: {
        name: invoice.client?.name ?? "Cliente",
        company: invoice.client?.company ?? "",
        cnpj: invoice.client?.taxId ?? "",
      },
      receiver: {
        name: "MERALI STUDIO DE VISUALIZACAO LTDA",
        cnpj: "50.123.456/0001-00",
      },
    });
  } catch (error) {
    console.error("[INVOICE_RECEIPT_GET]", error);
    return NextResponse.json(
      { error: "Erro ao gerar recibo" },
      { status: 500 },
    );
  }
}
