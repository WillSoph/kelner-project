'use client'
import { GetStaticProps } from 'next'
import { Fragment, useEffect, useRef, useState } from 'react'
import useAuth from '../data/hook/useAuth'
import { stripe } from '../services/stripe'
import { getStripeJs } from '../services/stripe-js'
import { api } from '../services/api'
import AuthInput from '../components/auth/AuthInput'
import { IconeAtencao } from '../components/icons'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import Link from 'next/link'
import ThemeChanger from './DarkSwitch'
import Image from 'next/image'
import { Disclosure } from '@headlessui/react'
import BotaoAssine from '../components/BotatoAssine'
import firebase from '../firebase/config'
import { useTotalAcessible } from '../data/context/TotalAcessibleContext'
import { useRouter } from 'next/router'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)
  const router = useRouter()

  const { cadastrar, login, logout, loginGoogle, usuario } = useAuth()
  const [usuarioId, setUsuarioId] = useState<string | null>(null)
  // const [totalAcessible, setTotalAcessible] = useState(false);
  const { totalAcessible, setTotalAcessible } = useTotalAcessible()

  const [erro, setErro] = useState(null)
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const product = {
    priceId: 'price_1O0UrrIYJ05oSoaZonPhWe4G',
    amount: 'R$ 20,00',
  }

  function exibirErro(msg, tempoEmSegundos = 5) {
    setErro(msg)
    setTimeout(() => setErro(null), tempoEmSegundos * 1000)
  }

  async function submeter() {
    try {
      if (modo === 'login') {
        if (login) {
          await login(email, senha)
        } else {
          throw new Error('Função de login não definida')
        }
      } else {
        if (cadastrar) {
          await cadastrar(email, senha)
        } else {
          throw new Error('Função de cadastro não definida')
        }
      }
    } catch (error) {
      console.error('Erro ao realizar ação:', error)
    }
    setOpen(false)
  }

  const navigation = ['Produto', 'Preços', 'Como funciona?', usuario?.nome]

  async function getUserIdFromEmail(email: string): Promise<string | null> {
    const usersCollection = firebase.firestore().collection('usuarios')
    const querySnapshot = await usersCollection
      .where('email', '==', usuario?.email)
      .get()

    if (!querySnapshot.empty) {
      // Retorna o ID do usuário encontrado
      console.log('ID do Usuario: ', querySnapshot.docs[0].id)
      return querySnapshot.docs[0].id
    }

    // Se nenhum usuário for encontrado, retorna null
    return null
  }

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromEmail(usuario?.email || '')
      setUsuarioId(id)
    }

    if (usuario?.email) {
      fetchUserId()
      renderizarBotaoAcessarPainel()
      async function renderizarBotaoAcessarPainel() {
        // Verifica se o usuário está logado
        if (usuario?.email) {
          // Verifica se o usuário tem uma assinatura ativa
          const hasActiveSubscription = await verificarAssinaturaAtiva()

          // Se o usuário tem uma assinatura ativa, renderiza o botão
          if (!hasActiveSubscription) {
            setTotalAcessible(false)
          } else {
            setTotalAcessible(true)
          }
        }

        // Se não atender aos critérios, retorna null (não renderiza o botão)
        return null
      }
    }
  }, [usuario])

  async function verificarAssinaturaAtiva(): Promise<boolean> {
    const subscriptionsCollection = firebase
      .firestore()
      .collection('subscriptions')
    const user = firebase.auth().currentUser

    if (user) {
      const userId = user.uid
      const userDocRef = firebase.firestore().collection('usuarios').doc(userId)

      const querySnapshot = await subscriptionsCollection
        .where('userId', '==', userDocRef)
        .where('status', '==', 'active')
        .get()
      console.log('teste 2: ', !querySnapshot.empty)
      return !querySnapshot.empty
    }

    return false
  }

  async function handleSubscribe() {
    if (!usuario?.email) {
      setOpen(true)
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err.message)
    }
  }

  function handlePainelRedirect() {
    router.push('/painel')
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div> */}
                      <div className="flex items-center justify-center">
                        <div className="w-full">
                          <h1 className={`mb-5 text-3xl font-bold`}>
                            {modo === 'login'
                              ? 'Entre com a Sua Conta'
                              : 'Cadastre-se na Plataforma'}
                          </h1>

                          {erro ? (
                            <div
                              className={`
                                    my-2 flex
                                    items-center rounded-lg border border-red-700 bg-red-400
                                    px-5 py-3 text-white
                                `}
                            >
                              {IconeAtencao()}
                              <span className="ml-3">{erro}</span>
                            </div>
                          ) : (
                            false
                          )}

                          <AuthInput
                            label="Email"
                            tipo="email"
                            valor={email}
                            valorMudou={setEmail}
                            obrigatorio
                          />
                          <AuthInput
                            label="Senha"
                            tipo="password"
                            valor={senha}
                            valorMudou={setSenha}
                            obrigatorio
                          />

                          <button
                            onClick={submeter}
                            className={`
                                mt-6 w-full rounded-lg
                                bg-indigo-500 px-4 py-3 text-white hover:bg-indigo-400
                            `}
                          >
                            {modo === 'login' ? 'Entrar' : 'Cadastrar'}
                          </button>

                          <hr className="my-6 w-full border-gray-300" />

                          <button
                            onClick={loginGoogle}
                            className={`
                                w-full rounded-lg bg-red-500
                                px-4 py-3 text-white hover:bg-red-400
                            `}
                          >
                            Entrar com Google
                          </button>

                          {modo === 'login' ? (
                            <p className="mt-8">
                              Novo por aqui?
                              <a
                                onClick={() => setModo('cadastro')}
                                className={`
                                        cursor-pointer font-semibold text-blue-500
                                        hover:text-blue-700
                                    `}
                              >
                                {' '}
                                Assine por {product.amount} mensais.
                              </a>
                              <BotaoAssine priceId={product.priceId}>
                                Inscreva-se agora
                              </BotaoAssine>
                            </p>
                          ) : (
                            <p className="mt-8">
                              Já faz parte da nossa comunidade?
                              <Link
                                href="#"
                                onClick={() => setModo('login')}
                                className={`
                                        cursor-pointer font-semibold text-blue-500
                                        hover:text-blue-700
                                    `}
                              >
                                {' '}
                                Entre com as suas Credenciais
                              </Link>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="w-full">
        <nav className="container relative mx-auto flex flex-wrap items-center justify-between p-8 lg:justify-between xl:px-0">
          {/* Logo  */}
          <Disclosure>
            {({ open }) => (
              <>
                <div className="flex w-full flex-wrap items-center justify-between lg:w-auto">
                  <Link href="/">
                    <span className="flex items-center space-x-2 text-2xl font-medium text-yellow-500 dark:text-gray-100">
                      <span>
                        <img
                          src="/images/logo.svg"
                          alt="N"
                          width="32"
                          height="32"
                          className="w-8"
                        />
                      </span>
                      <span>Kelner</span>
                    </span>
                  </Link>

                  <Disclosure.Button
                    aria-label="Toggle Menu"
                    className="dark:focus:bg-trueGray-700 ml-auto rounded-md px-2 py-1 text-gray-500 hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-300 lg:hidden"
                  >
                    <svg
                      className="h-6 w-6 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      {open && (
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                        />
                      )}
                      {!open && (
                        <path
                          fillRule="evenodd"
                          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                        />
                      )}
                    </svg>
                  </Disclosure.Button>

                  <Disclosure.Panel className="my-5 flex w-full flex-wrap lg:hidden">
                    <>
                      {/* {navigation.map((item, index) => (
                      <Link key={index} href="/" className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none">
                          {item}
                      </Link>
                    ))} */}
                      <Link
                        href="#beneficios"
                        className="-ml-4 w-full rounded-md px-4 py-2 text-gray-500 hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-300 dark:focus:bg-gray-800"
                      >
                        Benefícios
                      </Link>
                      {usuario?.email && (
                        <a
                          onClick={logout}
                          className="mt-3 w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white lg:ml-5"
                        >
                          Deslogar
                        </a>
                      )}
                      {usuario?.email && totalAcessible && (
                        <a
                          onClick={handlePainelRedirect}
                          className="mt-3 w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white lg:ml-5"
                        >
                          Acessar painel
                        </a>
                      )}
                      {usuario?.email && !totalAcessible ? (
                        <a
                          onClick={handleSubscribe}
                          className="mt-3 w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white lg:ml-5"
                        >
                          Assine Agora
                        </a>
                      ) : (
                        <a
                          onClick={() => setOpen(true)}
                          className="mt-3 w-full rounded-md bg-indigo-600 px-6 py-2 text-center text-white lg:ml-5"
                        >
                          Login / Cadastrar
                        </a>
                      )}
                      {/* {renderizarBotaoAcessarPainel()} */}
                    </>
                  </Disclosure.Panel>
                </div>
              </>
            )}
          </Disclosure>

          {/* menu  */}
          <div className="hidden text-center lg:flex lg:items-center">
            <ul className="flex-1 list-none items-center justify-end pt-6 lg:flex lg:pt-0">
              {/* {navigation.map((menu, index) => (
              <li className="mr-3 nav__item" key={index}>
                <Link href="/" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                    {menu}
                </Link>
              </li>
            ))} */}
              <li className="nav__item mr-3">
                <Link
                  href="#beneficios"
                  className="inline-block rounded-md px-4 py-2 text-lg font-normal text-gray-800 no-underline hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-200 dark:focus:bg-gray-800"
                >
                  Produto
                </Link>
              </li>
              <li className="nav__item mr-3">
                <Link
                  href="#beneficios"
                  className="inline-block rounded-md px-4 py-2 text-lg font-normal text-gray-800 no-underline hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-200 dark:focus:bg-gray-800"
                >
                  Benefícios
                </Link>
              </li>
              <li className="nav__item mr-3">
                <Link
                  href="#beneficios"
                  className="inline-block rounded-md px-4 py-2 text-lg font-normal text-gray-800 no-underline hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-200 dark:focus:bg-gray-800"
                >
                  Preço
                </Link>
              </li>
              <li className="nav__item mr-3">
                <Link
                  href="#beneficios"
                  className="inline-block rounded-md px-4 py-2 text-lg font-normal text-gray-800 no-underline hover:text-indigo-500 focus:bg-indigo-100 focus:text-indigo-500 focus:outline-none dark:text-gray-200 dark:focus:bg-gray-800"
                >
                  Como funciona?
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav__item mr-3 hidden space-x-4 lg:flex">
            {usuario?.email && (
              <>
                <a
                  onClick={logout}
                  className="rounded-md bg-gray-100 px-6 py-2 text-gray-800 md:ml-5"
                >
                  Olá {usuario?.nome}
                </a>
                <a
                  onClick={logout}
                  className="cursor-pointer rounded-md border-2 border-yellow-500 px-6 py-2 text-yellow-500 md:ml-5"
                >
                  Deslogar
                </a>
              </>
            )}
          </div>

          <div className="nav__item mr-3 hidden space-x-4 lg:flex">
            {usuario?.email && totalAcessible ? (
              <a
                onClick={handlePainelRedirect}
                className="cursor-pointer rounded-md bg-indigo-600 px-6 py-2 text-white md:ml-5"
              >
                Acessar painel
              </a>
            ) : usuario?.email && !totalAcessible ? (
              <a
                onClick={handleSubscribe}
                className="cursor-pointer rounded-md bg-indigo-600 px-6 py-2 text-white md:ml-5"
              >
                Assine Agora
              </a>
            ) : (
              <a
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-md bg-indigo-600 px-6 py-2 text-white md:ml-5"
              >
                Login / Cadastrar
              </a>
            )}
            {/* <ThemeChanger /> */}
          </div>
        </nav>
      </div>
    </>
  )
}
