import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { parse } from 'cookie';
import firebase from 'firebase/app';
import 'firebase/firestore';

const firestore = firebase.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            const cookies = parse(req.headers.cookie || '');

            const uidUser = cookies['admin-template-cod3r-auth-uid'];
            const emailUser = cookies['admin-template-cod3r-auth-token'];
            const currentUser = emailUser;

            console.log('user aqui? ', currentUser);

            if (!currentUser) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const stripeCustomerId = await criarStripeCustomerOuObterExiste(currentUser, uidUser);

            // Restante do seu código...

            const stripeCheckoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                payment_method_types: ['card'],
                billing_address_collection: 'required',
                line_items: [
                    { price: 'price_1O0UrrIYJ05oSoaZonPhWe4G', quantity: 1 }
                ],
                mode: 'subscription',
                allow_promotion_codes: true,
                success_url: process.env.STRIPE_SUCCESS_URL,
                cancel_url: process.env.STRIPE_CANCEL_URL
            });

            return res.status(200).json({ sessionId: stripeCheckoutSession.id });
        } else {
            res.setHeader('Allow', 'POST')
            res.status(405).end('Method not allowed')
        }
    } catch (error) {
        console.error("Erro na API Next.js:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

async function criarStripeCustomerOuObterExiste(email, uidUser) {
    const firestore = firebase.firestore();
    const usersCollection = firestore.collection('usuarios');

    const querySnapshot = await usersCollection.where('email', '==', email).get();

    if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        if (userData.stripe_customer_id) {
            console.log('Usuário já possui stripe_customer_id:', userData.stripe_customer_id);
            return userData.stripe_customer_id;
        }
    }

    const stripeCustomer = await stripe.customers.create({
        email: email,
        // metadata
    });

    await usersCollection.doc(uidUser).update({
        stripe_customer_id: stripeCustomer.id,
    });

    console.log('Novo stripe_customer_id criado:', stripeCustomer.id);
    return stripeCustomer.id;
}