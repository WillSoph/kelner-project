"use client"
import { GetStaticProps } from 'next'
import { Fragment, useEffect, useRef, useState } from 'react'
import useAuth from "../data/hook/useAuth"
import { stripe } from '../services/stripe'
import { getStripeJs } from '../services/stripe-js';
import { api } from '../services/api';
import AuthInput from "../components/auth/AuthInput"
import { IconeAtencao } from "../components/icons"
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image"
import { Disclosure } from "@headlessui/react";
import BotaoAssine from '../components/BotatoAssine'
import firebase from "../firebase/config";
import { useTotalAcessible } from '../data/context/TotalAcessibleContext'
import { useRouter } from 'next/router';


export default function Navbar() {
    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)
    const router = useRouter();

    const { cadastrar, login, logout, loginGoogle, usuario } = useAuth()
    const [usuarioId, setUsuarioId] = useState<string | null>(null);
    // const [totalAcessible, setTotalAcessible] = useState(false);
    const { totalAcessible, setTotalAcessible } = useTotalAcessible();

    const [erro, setErro] = useState(null)
    const [modo, setModo] = useState<'login' | 'cadastro'>('login')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const product = {
        priceId: 'price_1O0UrrIYJ05oSoaZonPhWe4G',
        amount: 'R$ 20,00',
      };

    function exibirErro(msg, tempoEmSegundos = 5) {
        setErro(msg)
        setTimeout(() => setErro(null), tempoEmSegundos * 1000)
    }

    async function submeter() {
        try {
            if (modo === 'login') {
                await login(email, senha)
            } else {
                await cadastrar(email, senha)
            }
        } catch(e) {
            exibirErro(e?.message ?? 'Erro desconhecido!')
        }
        setOpen(false)
    }

  const navigation = [
    "Produto",
    "Preços",
    "Como funciona?",
    usuario?.nome,
  ];

  async function getUserIdFromEmail(email: string): Promise<string | null> {
    const usersCollection = firebase.firestore().collection('usuarios');
    const querySnapshot = await usersCollection.where('email', '==', usuario?.email).get();
  
    if (!querySnapshot.empty) {
      // Retorna o ID do usuário encontrado
      console.log('ID do Usuario: ', querySnapshot.docs[0].id)
      return querySnapshot.docs[0].id;
    }
  
    // Se nenhum usuário for encontrado, retorna null
    return null;
  }

  useEffect(() => {    

    const fetchUserId = async () => {
      const id = await getUserIdFromEmail(usuario?.email || '');      
      setUsuarioId(id);
    };

    if (usuario?.email) {
      fetchUserId();
      renderizarBotaoAcessarPainel()
      async function renderizarBotaoAcessarPainel() {
        // Verifica se o usuário está logado
        if (usuario?.email) {
          // Verifica se o usuário tem uma assinatura ativa
          const hasActiveSubscription = await verificarAssinaturaAtiva();
      
          // Se o usuário tem uma assinatura ativa, renderiza o botão
          if (!hasActiveSubscription) {
            setTotalAcessible(false);
          } else {
            setTotalAcessible(true);
          }
        }
      
        // Se não atender aos critérios, retorna null (não renderiza o botão)
        return null;
      }
    }
  }, [usuario]);

  async function verificarAssinaturaAtiva(): Promise<boolean> {
    const subscriptionsCollection = firebase.firestore().collection('subscriptions');
    const user = firebase.auth().currentUser;
  
    if (user) {
      const userId = user.uid;
      const userDocRef = firebase.firestore().collection('usuarios').doc(userId);
  
      const querySnapshot = await subscriptionsCollection
        .where('userId', '==', userDocRef)
        .where('status', '==', 'active')
        .get();
        console.log('teste 2: ', !querySnapshot.empty)
      return !querySnapshot.empty;
    }
  
    return false;
  }

  async function handleSubscribe() {
    if (!usuario?.email) {
      setOpen(true)
      return;
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err.message);
    }
  }

  function handlePainelRedirect() {
    router.push('/painel')
  }

  return (
    <>
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                            <h1 className={`text-3xl font-bold mb-5`}>
                                {modo === 'login' ? 'Entre com a Sua Conta' : 'Cadastre-se na Plataforma'}
                            </h1>

                            {erro ? (
                                <div className={`
                                    flex items-center
                                    bg-red-400 text-white py-3 px-5 my-2
                                    border border-red-700 rounded-lg
                                `}>
                                    {IconeAtencao()}
                                    <span className="ml-3">{erro}</span>
                                </div>
                            ) : false}
                            
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

                            <button onClick={submeter} className={`
                                w-full bg-indigo-500 hover:bg-indigo-400
                                text-white rounded-lg px-4 py-3 mt-6
                            `}>
                                {modo === 'login' ? 'Entrar' : 'Cadastrar'}
                            </button>

                            <hr className="my-6 border-gray-300 w-full" />

                            <button onClick={loginGoogle} className={`
                                w-full bg-red-500 hover:bg-red-400
                                text-white rounded-lg px-4 py-3
                            `}>
                                Entrar com Google
                            </button>

                            {modo === 'login' ? (
                                <p className="mt-8">
                                    Novo por aqui?
                                    <a onClick={() => setModo('cadastro')} className={`
                                        text-blue-500 hover:text-blue-700 font-semibold
                                        cursor-pointer
                                    `}> Assine por {product.amount} mensais.</a>
                                    <BotaoAssine priceId={product.priceId}>
                                        Inscreva-se agora
                                    </BotaoAssine>    
                                </p>
                            ) : (
                                <p className="mt-8">
                                    Já faz parte da nossa comunidade?
                                    <Link href="#" onClick={() => setModo('login')} className={`
                                        text-blue-500 hover:text-blue-700 font-semibold
                                        cursor-pointer
                                    `}> Entre com as suas Credenciais</Link>
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
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">
        {/* Logo  */}
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
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
                  className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700">
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
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

                <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                  <>
                    {/* {navigation.map((item, index) => (
                      <Link key={index} href="/" className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none">
                          {item}
                      </Link>
                    ))} */}
                      <Link href="#beneficios" className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none">
                          Benefícios
                      </Link>
                      {usuario?.email && (
                      <a onClick={logout} className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5">
                        Deslogar
                      </a>
                      )}
                      {usuario?.email && totalAcessible && (
                        <a onClick={ handlePainelRedirect } className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5">         
                          Acessar painel
                      </a>
                      )}
                    {usuario?.email && !totalAcessible ? (
                      <a onClick={ handleSubscribe } className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5">         
                          Assine Agora
                      </a>
                    ):(
                      <a onClick={() => setOpen(true) } className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5">         
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
          <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
            {/* {navigation.map((menu, index) => (
              <li className="mr-3 nav__item" key={index}>
                <Link href="/" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                    {menu}
                </Link>
              </li>
            ))} */}
            <li className="mr-3 nav__item">
              <Link href="#beneficios" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                  Produto
              </Link>
            </li>
            <li className="mr-3 nav__item">
              <Link href="#beneficios" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                  Benefícios
              </Link>
            </li>
            <li className="mr-3 nav__item">
              <Link href="#beneficios" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                  Preço
              </Link>
            </li>
            <li className="mr-3 nav__item">
              <Link href="#beneficios" className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                  Como funciona?
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
          {usuario?.email && (
            <>
            <a onClick={logout} className="px-6 py-2 text-gray-800 bg-gray-100 rounded-md md:ml-5">
              Olá {usuario?.nome}
            </a>
            <a onClick={logout} className="px-6 py-2 cursor-pointer border-2 border-yellow-500 text-yellow-500 rounded-md md:ml-5">
              Deslogar
            </a>
            </>
          )}  
        </div>

        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
          {usuario?.email && totalAcessible ? 
            <a onClick={ handlePainelRedirect } className="px-6 py-2 cursor-pointer text-white bg-indigo-600 rounded-md md:ml-5">
              Acessar painel
            </a>
            :
            usuario?.email && !totalAcessible ? 
            <a onClick={ handleSubscribe } className="px-6 py-2 cursor-pointer text-white bg-indigo-600 rounded-md md:ml-5">
              Assine Agora
            </a>
            :
            <a onClick={() => setOpen(true) } className="px-6 py-2 cursor-pointer text-white bg-indigo-600 rounded-md md:ml-5">
              Login / Cadastrar
            </a>
          }
          {/* <ThemeChanger /> */}
        </div>
      </nav>
    </div>
    </>
  );
}