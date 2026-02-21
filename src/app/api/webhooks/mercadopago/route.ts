import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Payment } from 'mercadopago';
import { mpClient } from '@/lib/mercadopago';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Mercado Pago Webhook received:', body);

    // Mercado Pago notification format can vary. Usually it's in the body for V2.
    // data.id is the payment ID
    // action is 'payment.created' or 'payment.updated'
    const { action, data } = body;

    if (action === 'payment.created' || action === 'payment.updated' || !action) {
      // If no action, it might be an older notification format using search params
      // but let's stick to the modern one first.
      const paymentId = data?.id || body?.resource?.split('/').pop();

      if (paymentId) {
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({ id: paymentId });

        if (paymentData.status === 'approved') {
          // metadata stores invoiceId. In the preference creation we used invoiceId.
          // Note: Mercado Pago metadata keys are usually snake_case in the response even if sent as camelCase.
          const invoiceId = paymentData.metadata?.invoice_id || paymentData.external_reference;

          if (invoiceId) {
            await prisma.invoice.update({
              where: { id: invoiceId },
              data: {
                status: 'PAID',
                paidAt: new Date(),
                mercadopagoId: String(paymentId),
                paymentMethod: paymentData.payment_type_id === 'bank_transfer' ? 'MERCADOPAGO_PIX' : 'MERCADOPAGO_CARD'
              }
            });
            console.log(`Invoice ${invoiceId} marked as PAID via Mercado Pago payment ${paymentId}`);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Mercado Pago Webhook Error:', error);
    // Always return 200/201 to Mercado Pago to avoid retries if the error is on our side
    // unless we want them to retry.
    return NextResponse.json({ received: true });
  }
}
