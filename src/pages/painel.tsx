import axios from 'axios';
import { useRouter } from 'next/router';
import Botao from '../components/Botao'
import QRCodeModal from '../components/QRCodeModal';
import { Dialog, Transition } from '@headlessui/react'
import Formulario from '../components/Formulario'
import Tabela from '../components/Tabela'
import Layout from '../components/template/Layout'
import LayoutConteudo from '../components/template/LayoutConteudo'
import useAuth from '../data/hook/useAuth';
import useClientes from '../data/hook/useClientes'
import { useTotalAcessible } from '../data/context/TotalAcessibleContext';
import { useState, useEffect, useRef, Fragment } from "react";
// import QRCode from 'react-qr-code';
import QRCode from 'qrcode.react';

export default function Home() {

  const { usuario, carregando } = useAuth()
  const { totalAcessible, setTotalAcessible } = useTotalAcessible();
  const router = useRouter();
  const qrCodeRef = useRef<HTMLElement | null>(null);
  const cancelButtonRef = useRef(null)
  const [isQRCodeLoaded, setIsQRCodeLoaded] = useState(false);
  const [empresa, setEmpresa] = useState([])
  const [open, setOpen] = useState(false)  

  useEffect(() => {
    if (!totalAcessible) {
      router.push(`/`)
    }
  }, [totalAcessible]);

  const { 
    cliente, 
    clientes, 
    novoCliente, 
    salvarCliente,
    selecionarCliente, 
    excluirCliente ,
    tabelaVisivel,
    exibirTabela
  } = useClientes()

  const url = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clienteMudou = (cliente) => salvarCliente(cliente);

  const navegarParaCardapio = () => {
    // Aqui você pode obter o ID do usuário do seu contexto de autenticação ou de onde estiver disponível
    const idUsuario = usuario?.uid; // Substitua isso pelo código real para obter o ID do usuário
    window.open(`/cardapio/${idUsuario}`, '_blank', 'noopener,noreferrer');
  };
  const navegarParaEmpresa = () => {
    // Aqui você pode obter o ID do usuário do seu contexto de autenticação ou de onde estiver disponível
    const idUsuario = usuario?.uid; // Substitua isso pelo código real para obter o ID do usuário
    router.push(`/editar-empresa`);
  };

  useEffect(() => {
    if (usuario) {
      obterEmpresa();
    }
  }, [usuario]);

  const obterEmpresa = async () => {
    try {
        const response = await axios.get(`https://firestore.googleapis.com/v1/projects/${url}/databases/(default)/documents/usuarios/${usuario?.uid}/empresa`);
    
        const empresaData = response.data.documents;
        setEmpresa(empresaData[0])
      } catch (error) {
        console.error('Erro ao obter empresa:', error);
      }
};

  const cardapioQRCodeLink = `/cardapio/${usuario?.uid}`;

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
              <div id="modalContent" className="flex flex-col items-center bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <QRCode value={cardapioQRCodeLink} size={256} ref={qrCodeRef} />
                </div>
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md">
                  Tire um print do QRCode do seu cardápio e use onde precisar.
                </div>
              </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    <Layout titulo={empresa.fields?.nome.stringValue} subtitulo={usuario?.stripe_customer_id}>
      <div className={`
        flex justify-center items-center h-full 
        bg-gray-200 dark:bg-gray-900 rounded-md border-1 border-gray-500
      `}>
        <LayoutConteudo titulo="Cadastro simples">
          {tabelaVisivel ? (
            <>  
              <div className="flex justify-end mb-2 overflow-auto">
                <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" 
                  onClick={navegarParaEmpresa}>
                  Editar empresa
                </button>
                <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" 
                  onClick={() => setOpen(true) }>
                    Ver QRCode
                </button>
                <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" 
                  onClick={navegarParaCardapio}>
                  Cardápio
                </button>
                <button className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" 
                  onClick={novoCliente}>
                  Novo produto
                </button>
              </div>          
              <Tabela 
                clientes={clientes} 
                clienteSelecionado={selecionarCliente}
                clienteExcluido={excluirCliente}
              />
            </>
          ) : (
            <Formulario 
              cliente={cliente} 
              // clienteMudou={salvarCliente}
              clienteMudou={clienteMudou}
              cancelado={exibirTabela}
            />
          )} 
        </LayoutConteudo>  
      </div>
      
    </Layout>
  </>  
  )
}
