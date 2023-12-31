import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { stripe } from '../../services/stripe'
import { saveSubscription } from './_lib/manageSubscription'

async function buffer(readable: Readable) {
  const chunks: Buffer[] = [];

  for await (const chunk of readable) {
    if (typeof chunk === 'string') {
      chunks.push(Buffer.from(chunk));
    } else if (chunk instanceof Buffer) {
      chunks.push(chunk);
    }
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    console.log('Webhook payload:', buf.toString())
    const secret = req.headers['stripe-signature']
    console.log('Webhook signature:', secret)

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        Buffer.from(buf),
        secret || '',
        process.env.STRIPE_WEBHOOK_SECRET || ''
      )
      console.log('Webhook event type:', event.type)
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`)
    }

    const { type } = event

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            console.log('Handling subscription update or delete event.')
            const subscription = event.data.object as Stripe.Subscription

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            )

            break
            case 'checkout.session.completed':
            console.log('Handling checkout session completed event.');
            const checkoutSession = event.data.object as Stripe.Checkout.Session;

            if (checkoutSession.subscription && checkoutSession.customer) {
              await saveSubscription(
                checkoutSession.subscription.toString(),
                checkoutSession.customer.toString(),
                true
              );
            } else {
              console.error('Subscription or customer is null in checkout session completed event.');
            }
            
              break;
          default:
            console.error('Unhandled event type:', type)
            throw new Error('Unhandled event.')
        }
      } catch (err) {
        console.error('Webhook handler failed:', err.message)
        return res.json({ error: 'Webhook handler failed.' })
      }
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
