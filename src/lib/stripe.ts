import Stripe from 'stripe'

// Provide a dummy key during build if missing
const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy'

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.warn('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(stripeSecret, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})
