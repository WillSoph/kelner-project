import { useState, useEffect } from 'react'
import Vendas from '../core/Vendas'
import { FaSpinner } from 'react-icons/fa'
import Layout from '@/components/template/Layout'
import LayoutConteudo from '@/components/template/LayoutConteudo'
import useAuth from '@/data/hook/useAuth'
import axios from 'axios'
import useVendas from '@/data/hook/useVendas'

interface Produto {
  nome: string;
  descricao?: string;
  preco: string;
  quantidade: number;
}

interface Cliente {
  nome?: string;
}

interface VendaPedidoProps {
  cliente: Cliente;
  vendas: Vendas;
  clienteMudou?: (vendas: Vendas) => void;
  cancelado?: () => void;
}

export default function VendaPedido(props: VendaPedidoProps) {
  const { usuario, carregando } = useAuth()
  const [produtos, setProdutos] = useState<Array<any>>([]); // Você deve ajustar o tipo do array conforme a estrutura real dos dados
  const [salvando, setSalvando] = useState(false)
  const [nome, setNome] = useState(props.cliente?.nome ?? '')

  const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
  const [precoSelecionado, setPrecoSelecionado] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [listaDeCompras, setListaDeCompras] = useState<Array<Produto>>([]);

  const {
    salvarVendas,
  } = useVendas()


  const confirmarCompra = async () => {
    const dataHoraEnvio = new Date()
    setSalvando(true) // Define o estado para indicar que está salvando

    try {
      let enviarVenda: Vendas

      enviarVenda = new Vendas(
        listaDeCompras,
        dataHoraEnvio
      )
      await new Promise((resolve) => setTimeout(resolve, 1000))

      salvarVendas(enviarVenda)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSalvando(false)
    }
  }

  const url = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

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
  const produtosPorCategoria: Record<string, Produto[]> = {};

  if (produtos) {
    produtos.forEach((produto: any) => {
      const categoria = produto.fields.categoria?.stringValue;
  
      if (categoria) {
        if (!produtosPorCategoria[categoria]) {
          produtosPorCategoria[categoria] = [];
        }
  
        produtosPorCategoria[categoria].push({
          nome: produto.fields.nome?.stringValue,
          descricao: produto.fields.descricao?.stringValue,
          preco: produto.fields.preco?.stringValue,
          quantidade: produto.fields.quantidade?.stringValue,
        });
      }
    });
  }

  useEffect(() => {
    obterCardapio()
  },[])

  const adicionarProduto = () => {
    if (produtoSelecionado && quantidade > 0) {
      const precoNumerico = parseFloat(precoSelecionado.replace('R$ ', '').replace(',', '.'));
      setListaDeCompras([
        ...listaDeCompras,
        {
          nome: produtoSelecionado,
          quantidade: quantidade,
          preco: (precoNumerico * parseInt(quantidade.toString())).toFixed(2),
        },
      ]);
  
      // Limpar o estado do produto selecionado e quantidade
      setProdutoSelecionado('');
      setPrecoSelecionado('');
      setQuantidade(1);
    }
  };

  return (
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
      <LayoutConteudo titulo="Venda de pedido">

      <select
        value={produtoSelecionado}
        onChange={(e) => {
          const precoDoProduto = e.target.options[e.target.selectedIndex].getAttribute('data-preco');
          setProdutoSelecionado(e.target.value) 
          setPrecoSelecionado(precoDoProduto) 
        }}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
      >
        <option value="">Selecione um produto</option>
        {Object.keys(produtosPorCategoria).map((categoria) => (
          produtosPorCategoria[categoria].map((produto) => (
            <option key={produto.nome} value={produto.nome} data-preco={produto.preco}>
              {produto.nome}
            </option>
          ))
        ))}
      </select>

      {produtoSelecionado && (
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={produtoSelecionado}
            readOnly
            className="flex-grow p-2 mr-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-16 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => adicionarProduto()}
            className="ml-2 bg-blue-500 text-white p-2 rounded-md"
          >
            Adicionar
          </button>
        </div>
      )}

<div className="mt-4">
  <h2 className="text-lg font-semibold mb-2">Lista de Compras</h2>
  <ul>
    {listaDeCompras.map((item, index) => (
      <li key={index} className="p-4 mb-2 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 flex justify-between" role="alert">
        <span className="font-medium">{item.nome}</span>
        <span className="font-medium">QUANTIDADE: {item.quantidade}</span>
        <span className="font-medium">PREÇO: {item.preco}</span>
      </li>
    ))}
  </ul>
</div>



      <div className="mt-7 flex justify-end">
      <button onClick={() => confirmarCompra()} className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">
          {salvando ? (
            <>
              <FaSpinner className="mr-2 animate-spin" /> Salvando
            </>
          ) : (
            'Confirmar compra'
          )}
      </button>
        <button
          onClick={props.cancelado}
          className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 sm:ml-3 sm:w-auto"
        >
          Cancelar
        </button>
      </div>
      </LayoutConteudo>
      </div>
    </Layout>
  )
}
