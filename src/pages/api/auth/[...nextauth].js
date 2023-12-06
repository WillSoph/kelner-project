import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = getFirestore(firebase);

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FirebaseAdapter(firestore),
  callbacks: {
    async signIn(user, account, profile) {
      const auth = getAuth(firebase);
      const googleProvider = new GoogleAuthProvider();

      // Aqui você pode adicionar lógica personalizada ao processo de autenticação.
      // Por exemplo, verificar se o usuário já existe no Firestore, salvar informações adicionais, etc.

      try {
        await signInWithPopup(auth, googleProvider);
        return true; // Retorna true para permitir o login após a autenticação.
      } catch (error) {
        console.error("Erro durante a autenticação:", error);
        return false; // Retorna false para impedir o login em caso de erro.
      }
    },
  },
});