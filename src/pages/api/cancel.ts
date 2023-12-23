import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '../../services/stripe'
import { parse } from 'cookie'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default async function handleCancelSubscription(req: NextApiRequest, res: NextApiResponse) {  
  const cookies = parse(req.headers.cookie || '')
  const uidUser = cookies['admin-template-cod3r-auth-uid']    
    try {
      if (req.method === 'POST') {

      const firestore = firebase.firestore()
      const subscriptionsCollection = firestore.collection('subscriptions');

      // Consulta a coleção 'subscriptions' com base na referência 'userId'
      const subscriptionQuery = await subscriptionsCollection
        .where('userId', '==', firestore.doc(`usuarios/${uidUser}`))
        .get();

      if (subscriptionQuery.empty) {
        console.error('Nenhuma assinatura encontrada para o usuário:', uidUser);
        return res.status(400).json({ error: 'Assinatura não encontrada.' });
      }

      // Obtém os dados da primeira assinatura encontrada
      const subscriptionData = subscriptionQuery.docs[0].data();
      const subscriptionId = subscriptionData.id;

      const usersCollection = firestore.collection('usuarios')
      const userDoc = await usersCollection.doc(uidUser).get();
      const userInfo = userDoc.data();
      const userEmail = userInfo?.email;
      console.log('Email agora: ',userEmail)
      
      
      const querySnapshot = await usersCollection.where('email', '==', userEmail).get()
      const userData = querySnapshot.docs[0].data()

    //   const stripe = require('stripe')(process.env.STRIPE_API_KEY);

      if (!userData || !userData.stripe_customer_id) {
        console.error('Usuário ou stripe_customer_id não encontrado.');
        return { error: 'Usuário ou stripe_customer_id não encontrado.' };
      }

      const subscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        },
      )
      console.log("Envio: ",subscription)
      return res.status(200).json(subscription);
    } else {
      res.setHeader('Allow', 'POST')
      res.status(405).end('Method not allowed')
    }
    } catch (err) {
      console.error(err);
    }    
  }