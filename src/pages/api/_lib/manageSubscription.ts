import firebase from "../../../firebase/config";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  const usersCollection = firebase.firestore().collection('usuarios');

  const userDoc = await usersCollection.where('stripe_customer_id', '==', customerId).get();

  if (userDoc.empty) {
    console.error(`User not found with stripe_customer_id: ${customerId}`);
    return;
  }

  const userData = userDoc.docs[0].data();

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userDoc.docs[0].ref, // Use the Firestore reference directly
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await firebase.firestore().collection('subscriptions').add(subscriptionData);
  } else {
    const subscriptionDoc = await firebase.firestore().collection('subscriptions')
      .where('id', '==', subscriptionId).get();

    if (!subscriptionDoc.empty) {
      await subscriptionDoc.docs[0].ref.update(subscriptionData);
    } else {
      console.error(`Subscription not found with id: ${subscriptionId}`);
    }
  }
}