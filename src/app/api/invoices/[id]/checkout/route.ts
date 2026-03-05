import { Preference, Payment } from "mercadopago";
import { NextResponse } from "next/server";
import { mpClient } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// Supported methods:
//   gateway: 'stripe' | 'mercadopago'  → legacy modal flow (both methods)
//   method:  'pix' | 'card_installments' | 'card' | 'boleto' → single-method link
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { gateway, method } = body as { gateway?: string; method?: string };

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { client: true, budget: true },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Fatura não encontrada" },
        { status: 404 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const isProduction = appUrl.startsWith("https://");
    const itemTitle = `PROJETO: ${invoice.budget?.projectName || "SERVIÇOS DE VISUALIZAÇÃO"}`;
    const itemDesc = `REFERENTE À FATURA #${invoice.id.slice(-6).toUpperCase()}`;

    // ── Stripe ──────────────────────────────────────────────────────────────────
    // Handles: gateway='stripe', method='card', method='boleto'
    const useStripe =
      gateway === "stripe" || method === "card" || method === "boleto";
    if (useStripe) {
      const methodTypes: ("card" | "boleto")[] =
        method === "boleto"
          ? ["boleto"]
          : method === "card"
            ? ["card"]
            : ["card", "boleto"]; // legacy: both

      const session = await stripe.checkout.sessions.create({
        payment_method_types: methodTypes,
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: { name: itemTitle, description: itemDesc },
              unit_amount: Math.round(invoice.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/invoices/${invoice.id}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/invoices/${invoice.id}`,
        metadata: { invoiceId: invoice.id },
        customer_email: invoice.client.email || undefined,
      });

      return NextResponse.json({ url: session.url });
    }

    // ── Mercado Pago ─────────────────────────────────────────────────────────────
    if (method === "pix") {
      const payment = new Payment(mpClient);
      const paymentResponse = await payment.create({
        body: {
          transaction_amount: Number(invoice.amount),
          description: itemTitle,
          payment_method_id: "pix",
          payer: {
            email: invoice.client.email || "contato@merali.com.br",
            first_name: invoice.client.name.split(" ")[0],
            last_name: invoice.client.name.split(" ").slice(1).join(" ") || "Cliente",
          },
          // Recommended: Detailed item info for fraud prevention
          additional_info: {
            items: [
              {
                id: invoice.id,
                title: itemTitle,
                description: itemDesc,
                category_id: "others", // or 'services'
                quantity: 1,
                unit_price: Number(invoice.amount),
              }
            ],
            payer: {
              first_name: invoice.client.name.split(" ")[0],
              last_name: invoice.client.name.split(" ").slice(1).join(" ") || "Cliente",
              phone: invoice.client.phone ? { number: invoice.client.phone.replace(/\D/g, "") } : undefined,
            }
          },
          metadata: { invoice_id: invoice.id },
          external_reference: invoice.id,
          notification_url: `${appUrl}/api/webhooks/mercadopago`,
        },
        // Mandatory for many MP flows: prevent double payments
        requestOptions: { idempotencyKey: invoice.id + "_pix" }
      });

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { mercadopagoId: String(paymentResponse.id) },
      });

      return NextResponse.json({
        url: paymentResponse.point_of_interaction?.transaction_data?.ticket_url
      });
    }

    // Handles: gateway='mercadopago', method='card_installments'
    const excludedTypes: { id: string }[] =
      method === "card_installments"
        ? [
          { id: "bank_transfer" }, // PIX
          { id: "debit_card" },
          { id: "ticket" },
          { id: "prepaid_card" },
        ]
        : // legacy modal: allow both
        [
          { id: "ticket" },
          { id: "atm" },
          { id: "debit_card" },
          { id: "prepaid_card" },
        ];

    const maxInstallments = 12;

    const preference = new Preference(mpClient);
    const response = await preference.create({
      body: {
        items: [
          {
            id: invoice.id,
            title: itemTitle,
            description: itemDesc,
            category_id: "others", // Categorização recomendada
            quantity: 1,
            unit_price: Number(invoice.amount),
            currency_id: "BRL",
          },
        ],
        payer: {
          email: invoice.client.email || undefined,
          name: invoice.client.name,
        },
        payment_methods: {
          excluded_payment_types: excludedTypes,
          installments: maxInstallments,
        },
        ...(isProduction && {
          back_urls: {
            success: `${appUrl}/invoices/${invoice.id}/success`,
            failure: `${appUrl}/invoices/${invoice.id}`,
            pending: `${appUrl}/invoices/${invoice.id}`,
          },
          auto_return: "approved" as const,
        }),
        metadata: { invoice_id: invoice.id },
        external_reference: invoice.id,
      },
    });

    // Store last preference ID (non-blocking)
    prisma.invoice
      .update({
        where: { id: invoice.id },
        data: { mercadopagoId: response.id },
      })
      .catch((err: unknown) =>
        console.warn("Could not store mercadopagoId:", err),
      );

    return NextResponse.json({ url: response.init_point });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento" },
      { status: 500 },
    );
  }
}
