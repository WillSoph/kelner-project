import Stripe from 'stripe'

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  throw new Error('Chave pública do Stripe não definida');
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Kelner',
    version: '1.2.3',
  },  
})
