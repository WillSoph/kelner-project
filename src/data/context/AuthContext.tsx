'use client'
import route from 'next/router'
import { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import firebase from '../../firebase/config'
import Usuario from '../../model/Usuario'

interface AuthContextProps {
  usuario?: Usuario
  carregando?: boolean
  cadastrar?: (email: string, senha: string) => Promise<void>
  login?: (email: string, senha: string) => Promise<void>
  loginAutenticado?: (email: string, senha: string) => Promise<void>
  loginGoogle?: () => Promise<void>
  logout?: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({})

async function usuarioNormalizado(
  usuarioFirebase: firebase.User
): Promise<Usuario> {
  const token = await usuarioFirebase.getIdToken()
  const usuario = await usuarioFirebase
  Cookies.set('admin-template-cod3r-auth-uid', usuario.uid, {
    expires: 7,
  })
  return {
    uid: usuarioFirebase.uid,
    nome: usuarioFirebase.displayName || '',
    email: usuarioFirebase.email || '',
    stripe_customer_id: usuarioFirebase.stripe_customer_id,
    token,
    provedor: usuarioFirebase.providerData[0].providerId,
    imagemUrl: usuarioFirebase.photoURL || '',
  }
}

async function gerenciarCookie(logado: any) {
  if (logado) {
    Cookies.set('admin-template-cod3r-auth', logado, {
      expires: 7,
    })
  } else {
    Cookies.remove('admin-template-cod3r-auth')
    Cookies.remove('admin-template-cod3r-auth-token')
    Cookies.remove('admin-template-cod3r-auth-uid')
  }
}

export function AuthProvider(props) {
  const [carregando, setCarregando] = useState(true)
  const [usuario, setUsuario] = useState<Usuario>(null)

  async function configurarSessao(usuarioFirebase) {
    if (usuarioFirebase?.email) {
      const usuario = await usuarioNormalizado(usuarioFirebase)
      setUsuario(usuario)
      gerenciarCookie(true)
      setCarregando(false)
      return usuario.email
    } else {
      setUsuario(null)
      gerenciarCookie(false)
      setCarregando(false)
      return false
    }
  }

  async function login(email, senha) {
    try {
      setCarregando(true)
      const resp = await firebase
        .auth()
        .signInWithEmailAndPassword(email, senha)

      await configurarSessao(resp.user)
      Cookies.set('admin-template-cod3r-auth-token', email, {
        expires: 1,
      })
      route.push('/')
    } finally {
      setCarregando(false)
    }
  }

  async function loginAutenticado(email, senha) {
    try {
      setCarregando(true)
      const resp = await firebase
        .auth()
        .signInWithEmailAndPassword(email, senha)

      await configurarSessao(resp.user)
      Cookies.set('admin-template-cod3r-auth-token', email, {
        expires: 1,
      })
      route.push('/painel')
    } finally {
      setCarregando(false)
    }
  }

  async function cadastrar(email, senha) {
    try {
      setCarregando(true)
      const resp = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, senha)

      // Verifique se o usuário foi criado com sucesso
      if (resp.user) {
        console.log('Novo usuário criado:', resp.user)

        // Adicione informações adicionais ao Firestore
        const firestore = firebase.firestore() // Obtenha a instância do Firestore
        await firestore.collection('usuarios').doc(resp.user.uid).set({
          email: email,
          id: resp.user.uid,
          // outras informações, se necessário
        })

        await configurarSessao(resp.user)
        route.push('/')
      } else {
        console.error('Falha ao criar usuário. Resp.user é nulo.')
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
    } finally {
      setCarregando(false)
    }
  }

  async function loginGoogle() {
    try {
      setCarregando(true)
      const resp = await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())

      await configurarSessao(resp.user)
      route.push('/')
    } finally {
      setCarregando(false)
    }
  }

  async function logout() {
    try {
      setCarregando(true)
      await firebase.auth().signOut()
      await configurarSessao(null)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (Cookies.get('admin-template-cod3r-auth')) {
      const cancelar = firebase.auth().onIdTokenChanged(configurarSessao)
      return () => cancelar()
    } else {
      setCarregando(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        login,
        cadastrar,
        loginGoogle,
        logout,
        loginAutenticado,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext
