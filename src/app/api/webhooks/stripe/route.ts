import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { createNotification } from '@/lib/notifications'

// Define the relevant events we care about
const RELEVANT_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
])

function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    console.error('Webhook Error: Missing signature or STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook configuration error' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (!RELEVANT_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as any
        const invoiceId = session.metadata?.invoiceId

        if (!invoiceId) {
          console.warn('Stripe webhook: no invoiceId in session metadata')
          break
        }

        let paymentDetails: any = {
          sessionId: session.id,
          customerEmail: session.customer_details?.email,
        }

        // Try to get more details from the payment intent
        if (session.payment_intent) {
          try {
            const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string, {
              expand: ['payment_method']
            })
            const pm = pi.payment_method as any
            if (pm?.type === 'card') {
              paymentDetails.card = {
                brand: pm.card.brand,
                last4: pm.card.last4,
                exp_month: pm.card.exp_month,
                exp_year: pm.card.exp_year,
              }
            } else if (pm?.type === 'boleto') {
              paymentDetails.boleto = {
                barcode: pm.boleto?.display_details?.barcode
              }
            }
          } catch (e) {
            console.error('Error fetching PI details:', e)
          }
        }

        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            stripeId: session.id,
            paymentMethod: session.payment_method_types?.[0] === 'card' ? 'STRIPE_CARD' : 'STRIPE_BOLETO',
            paymentDetails: paymentDetails
          }
        })

        console.log(`✅ Invoice ${invoiceId} marked as PAID via Stripe event ${event.type}`)

        // Fetch invoice with client to build notification
        const invoice = await prisma.invoice.findUnique({
          where: { id: invoiceId },
          include: { client: true }
        })

        const amountFormatted = session.amount_total
          ? formatBRL(session.amount_total / 100)
          : 'valor desconhecido'

        await createNotification({
          title: 'Pagamento Confirmado',
          description: `${invoice?.client.name ?? 'Cliente'} pagou ${amountFormatted} via Stripe.`,
          type: 'success',
          link: '/invoices'
        })

        console.log('🔔 Notification created for payment confirmation')
        break
      }

      case 'checkout.session.async_payment_failed':
      case 'payment_intent.payment_failed': {
        const obj = event.data.object as any
        const invoiceId = obj.metadata?.invoiceId

        if (invoiceId) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'PENDING' }
          })

          const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { client: true }
          })

          await createNotification({
            title: 'Falha no Pagamento',
            description: `O pagamento de ${invoice?.client.name ?? 'cliente desconhecido'} falhou ou foi recusado.`,
            type: 'error',
            link: '/invoices'
          })

          console.warn(`❌ Payment failed for Invoice ${invoiceId}: ${event.type}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  } catch (err: any) {
    console.error(`Database error handling Stripe webhook: ${err.message}`)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
