import useAuth from '../../data/hook/useAuth'
import { IconeCasa, IconeSair, IconeLixo } from '../icons'
import Logo from './Logo'
import MenuItem from './MenuItem'
import { api } from '../../services/api'
import { IconeAtencao } from '../../components/icons'
import { getStripeJs } from '../../services/stripe-js'
import { stripe } from '../../services/stripe'
import { parse } from 'cookie'
import Cookies from 'js-cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { usuario } from '../../data/context/AuthContext'
import { useState, Fragment,useRef } from 'react'
import { Dialog, Transition, Disclosure } from '@headlessui/react'
import {
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  RocketLaunchIcon,
  KeyIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid'

export default function MenuLateral() {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)
  const {
    usuario 
  } = useAuth()

  const { logout } = useAuth()

  function handleCancelSubscription() {
      
    try {
      api.post('/cancel')
      setOpen(false)
      alert('Sua assinatura foi cancelada')
    } catch (err) {
      console.error(err);
    }    
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
                            Tem certeza que deseja cancelar sua assinatura?
                          </h1>
                            <div
                              className={`
                                    my-2 flex
                                    items-center rounded-lg border border-red-700 bg-red-400
                                    px-5 py-3 text-white
                                `}
                            >
                              {IconeAtencao()}
                              <span className="ml-3">Ao efetuar o cancelamento da sua assinatura, ela ficará ativa até a data previamente contratada e não haverão mais cobranças à partir do final do período.</span>
                            </div>

                          {/* <button
                            onClick={handleCancelSubscription}
                            className={`
                                mt-6 w-full rounded-lg
                                bg-indigo-500 px-4 py-3 text-white hover:bg-indigo-400
                            `}
                          >
                            Cancelar assinatura
                          </button> */}

                          <hr className="my-6 w-full border-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleCancelSubscription}
                    >
                      Cancelar assinatura
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Voltar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

    <aside
      className={`
            flex flex-col
            bg-gray-200 text-gray-700
            dark:bg-gray-900
        `}
    >
      <div
        className={`
                flex h-20 w-20 flex-col
                items-center justify-center bg-gradient-to-r
                from-gray-700 to-gray-900
            `}
      >
        {/* <Logo /> */}
          <img
            src="/images/logo-cardapio.png"
            alt="N"
            width="42"
            height="42"
            className="w-8"
          />
      </div>
      <ul className="flex-grow">
        <MenuItem url="/" texto="Início" icone={<HomeIcon style={{height:'24px'}} />} />
        {/* <MenuItem url="/ajustes" texto="Ajustes" icone={IconeAjustes} />
                <MenuItem url="/notificacoes" texto="Notificações" icone={IconeSino} /> */}
      </ul>
      <ul>
        <MenuItem
          texto="Cancelar Assinatura"
          icone={<XCircleIcon style={{height:'24px'}} />}
          onClick={() => setOpen(true)}
          // onClick={handleCancelSubscription}
          className={`
                        text-red-600 hover:bg-red-400
                        hover:text-white dark:text-red-400
                        dark:hover:text-white
                    `}
        />
      </ul>
      <ul>
        <MenuItem
          texto="Sair"
          icone={<ArrowLeftOnRectangleIcon style={{height:'24px'}} />}
          onClick={logout}
          className={`
                        text-red-600 hover:bg-red-400
                        hover:text-white dark:text-red-400
                        dark:hover:text-white
                    `}
        />
      </ul>
    </aside>
    </>
  )
}
