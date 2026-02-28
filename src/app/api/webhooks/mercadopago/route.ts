import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Payment } from 'mercadopago';
import { mpClient } from '@/lib/mercadopago';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, type, data } = body;

    console.log(`[MercadoPago Webhook] Received ${action || 'notification'} for ${type || 'resource'}:`, body);

    // We mainly care about payment updates
    if (type === 'payment' || action?.startsWith('payment.')) {
      const paymentId = data?.id || body.resource?.split('/').pop();

      if (!paymentId) {
        return NextResponse.json({ error: 'No payment ID found' }, { status: 400 });
      }

      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: paymentId });

      // Identify the invoice
      const invoiceId = paymentData.metadata?.invoice_id || paymentData.external_reference;

      if (!invoiceId) {
        console.warn(`[MercadoPago Webhook] No invoiceId associated with payment ${paymentId}`);
        return NextResponse.json({ received: true });
      }

      switch (paymentData.status) {
        case 'approved':
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'PAID',
              paidAt: new Date(),
              mercadopagoId: String(paymentId),
              paymentMethod: paymentData.payment_type_id === 'bank_transfer' ? 'MERCADOPAGO_PIX' : 'MERCADOPAGO_CARD'
            }
          });
          console.log(`✅ Invoice ${invoiceId} marked as PAID via Mercado Pago payment ${paymentId}`);
          break;

        case 'rejected':
        case 'cancelled':
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'PENDING' }
          });
          console.warn(`❌ Mercado Pago payment ${paymentId} was ${paymentData.status} for Invoice ${invoiceId}`);
          break;

        case 'pending':
        case 'in_process':
          console.log(`⏳ Mercado Pago payment ${paymentId} is still pending for Invoice ${invoiceId}`);
          break;

        default:
          console.log(`Unhandled payment status: ${paymentData.status}`);
      }
    }

    // Always return 200/201 to MP to acknowledge
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[MercadoPago Webhook Error]:', error.message || error);
    // Return received: true even on error to stop MP retrying broken notifications 
    // unless you specifically want them to retry.
    return NextResponse.json({ received: true });
  }
}

