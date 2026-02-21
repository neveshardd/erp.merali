import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  let event

  try {
    if (!sig) throw new Error('No signature')
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as any
      const invoiceId = session.metadata.invoiceId

      if (invoiceId) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            stripeId: session.id,
            paymentMethod: session.payment_method_types[0] === 'card' ? 'STRIPE_CARD' : 'STRIPE_BOLETO'
          }
        })
      }
      break
    
    // For Boleto, it might take a few days
    case 'payment_intent.succeeded':
        // Already handled by checkout.session.completed for most cases, 
        // but good for redundancy or direct PI usage
        break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
