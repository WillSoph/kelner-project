import axios from 'axios'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import Formulario from '../components/Formulario'
import Tabela from '../components/Tabela'
import Layout from '../components/template/Layout'
import LayoutConteudo from '../components/template/LayoutConteudo'
import useAuth from '../data/hook/useAuth'
import useClientes from '../data/hook/useClientes'
import { useTotalAcessible } from '../data/context/TotalAcessibleContext'
import { useState, useEffect, useRef, Fragment, forwardRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import  ImprimirCardapio from './imprimirCardapio';
// import QRCode from 'react-qr-code';
import QRCode from 'qrcode.react'
import {
  PencilIcon,
  PlusIcon,
  ListBulletIcon,
  QrCodeIcon,
  PrinterIcon
} from '@heroicons/react/24/solid'

export default function Home() {
  const { usuario, carregando } = useAuth()
  const { totalAcessible, setTotalAcessible } = useTotalAcessible()
  const router = useRouter()
  const qrCodeRef = useRef<SVGSVGElement  | null>(null)
  const cancelButtonRef = useRef(null)
  const [isQRCodeLoaded, setIsQRCodeLoaded] = useState(false)
  const [empresa, setEmpresa] = useState([])
  const [produtos, setProdutos] = useState([])
  const [imagemEmpresa, setImagemEmpresa] = useState()
  const [nome, setNome] = useState()
  const [categorias, setCategorias] = useState()
  const [open, setOpen] = useState(false)
  const [openImpressao, setOpenImpressao] = useState(false)
  const [isImpressao, setIsImpressao] = useState(false)
  const [isImprimirCardapioReady, setIsImprimirCardapioReady] = useState(false);

  useEffect(() => {
    if (!totalAcessible) {
      router.push(`/`)
    }
  }, [totalAcessible])

  const {
    cliente,
    clientes,
    novoCliente,
    salvarCliente,
    selecionarCliente,
    excluirCliente,
    tabelaVisivel,
    exibirTabela,
  } = useClientes()

  const url = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clienteMudou = (cliente) => salvarCliente(cliente)

  const navegarParaCardapio = () => {
    // Aqui você pode obter o ID do usuário do seu contexto de autenticação ou de onde estiver disponível
    const idUsuario = usuario?.uid // Substitua isso pelo código real para obter o ID do usuário
    window.open(`/cardapio/${idUsuario}`, '_blank', 'noopener,noreferrer')
  }
  const navegarParaEmpresa = () => {
    // Aqui você pode obter o ID do usuário do seu contexto de autenticação ou de onde estiver disponível
    const idUsuario = usuario?.uid // Substitua isso pelo código real para obter o ID do usuário
    router.push(`/editar-empresa`)
  }

  const imprimirCardapio = () => {
    setOpenImpressao(true)
    obterCardapio()    
  }

  useEffect(() => {
    if (usuario) {
      obterEmpresa()
    }
  }, [usuario])

  const obterEmpresa = async () => {
    try {
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/${url}/databases/(default)/documents/usuarios/${usuario?.uid}/empresa`
      )

      const empresaData = response.data.documents
      setEmpresa(empresaData[0])
      setNome(empresaData[0].fields.nome?.stringValue)
      setImagemEmpresa(empresaData[0].fields.imagemUrl?.stringValue)      
    } catch (error) {
      console.error('Erro ao obter produtos:', error)
    }
  }

  const obterCardapio = async () => {
    try {
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/${url}/databases/(default)/documents/usuarios/${usuario?.uid}/clientes`
      )

      const produtosData = response.data.documents
      setProdutos(produtosData)
    } catch (error) {
      console.error('Erro ao obter empresa:', error)
    }
  };

  const produtosPorCategoria = {};
  produtos.forEach((produto) => {
    const categoria = produto.fields.categoria.stringValue;

    if (!produtosPorCategoria[categoria]) {
      produtosPorCategoria[categoria] = [];
    }

    produtosPorCategoria[categoria].push({
      nome: produto.fields.nome.stringValue,
      descricao: produto.fields.descricao.stringValue,
      preco: produto.fields.preco.stringValue,
    });
  });

  const cardapioQRCodeLink = `/cardapio/${usuario?.uid}`

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
                  <div
                    id="modalContent"
                    className="flex flex-col items-center bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
                  >
                    <div className="mb-4">
                      <QRCode
                        value={cardapioQRCodeLink}
                        size={256}
                        ref={qrCodeRef}
                      />
                    </div>
                    <div className="rounded-md bg-gray-200 px-4 py-2 text-gray-900">
                      Tire um print do QRCode do seu cardápio e use onde
                      precisar.
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={openImpressao} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenImpressao}
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-orange-100 text-left shadow-xl transition-all sm:my-8 sm:px-8 sm:w-full sm:max-w-2xl max-h-screen overflow-y-auto">
                {/* <ImprimirCardapio />
                <button>Imprimir</button> */}
                    {Object.keys(produtosPorCategoria).map((categoria) => (
                    <div key={categoria}>
                      <h2 className="text-3xl font-semibold mb-4">{categoria}</h2>
                      {produtosPorCategoria[categoria].map((produto) => (
                        <div key={produto.nome} className="mb-2">
                          <p className="text-lg font-semibold">{produto.nome}</p>
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-800">{produto.descricao}</p>
                            <p className="text-sm font-bold pl-8 flex-none">{`R$ ${produto.preco}`}</p>
                          </div>
                        </div>
                      ))}
                      <div className="border-b border-dashed border-gray-500 my-4"></div>
                    </div>                    
                  ))}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Layout
        titulo={nome ? nome : ''}
        subtitulo={usuario?.stripe_customer_id ? usuario?.stripe_customer_id : ''}
      >
        <div
          className={`
        border-1 flex h-full items-center 
        justify-center rounded-md border-gray-500 bg-gray-200 dark:bg-gray-900
      `}
        >
          <LayoutConteudo titulo="Cadastro simples">
            {tabelaVisivel ? (
              <>
                <div className="mb-2 flex justify-end overflow-auto">
                  <button
                    className="inline-flex w-full gap-1 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={navegarParaEmpresa}
                  >
                    <PencilIcon style={{height:'16px'}} />
                    Editar empresa
                  </button>
                  <button
                    className="inline-flex w-full items-center gap-1 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(true)}
                  >
                    <QrCodeIcon style={{height:'16px'}} />
                    Ver QRCode
                  </button>
                  <button
                    className="inline-flex w-full items-center gap-1 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={imprimirCardapio}
                  >
                    <PrinterIcon style={{height:'16px'}} />
                    Imprimir cardápio
                  </button>
                  <button
                    className="inline-flex w-full items-center gap-1 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={navegarParaCardapio}
                  >
                    <ListBulletIcon style={{height:'16px'}} />
                    Cardápio virtual
                  </button>
                  <button
                    className="inline-flex w-full items-center gap-1 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={novoCliente}
                  >
                    <PlusIcon style={{height:'16px'}} />
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
