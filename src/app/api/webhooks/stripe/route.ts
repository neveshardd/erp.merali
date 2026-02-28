import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Define the relevant events we care about
const RELEVANT_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
])

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

  if (RELEVANT_EVENTS.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded': {
          const session = event.data.object as any
          const invoiceId = session.metadata?.invoiceId

          if (invoiceId) {
            await prisma.invoice.update({
              where: { id: invoiceId },
              data: {
                status: 'PAID',
                paidAt: new Date(),
                stripeId: session.id,
                paymentMethod: session.payment_method_types?.[0] === 'card' ? 'STRIPE_CARD' : 'STRIPE_BOLETO'
              }
            })
            console.log(`✅ Invoice ${invoiceId} marked as PAID via Stripe event ${event.type}`)
          }
          break
        }

        case 'checkout.session.async_payment_failed':
        case 'payment_intent.payment_failed': {
          const obj = event.data.object as any
          const invoiceId = obj.metadata?.invoiceId || obj.last_payment_error?.payment_method?.metadata?.invoiceId
          
          if (invoiceId) {
            await prisma.invoice.update({
              where: { id: invoiceId },
              data: { status: 'PENDING' } // or mark as FAILED if we want to track it
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
  }

  return NextResponse.json({ received: true })
}

