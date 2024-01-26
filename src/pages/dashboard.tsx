import { useState, useEffect } from 'react'
import firebase from '../firebase/config'
import Vendas from '../core/Vendas'
import Botao from '../components/Botao'
import Entrada from '../components/Entrada'
import SelectInput from '../components/SelectInput'
import { uploadImagem } from '../core/UploadImagem'
import { FaSpinner } from 'react-icons/fa'
import Image from 'next/image'
import Layout from '@/components/template/Layout'
import LayoutConteudo from '@/components/template/LayoutConteudo'
import useAuth from '@/data/hook/useAuth'
import axios from 'axios'
import useVendas from '@/data/hook/useVendas'

import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
// import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Dashboard() {
  const { usuario, carregando } = useAuth()
  const [produtos, setProdutos] = useState([])
  const [salvando, setSalvando] = useState(false)
  // const id = props.cliente?.id
  const [nome, setNome] = useState()
  const [imagem, setImagem] = useState<File | null>(null)

  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [precoSelecionado, setPrecoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [listaDeCompras, setListaDeCompras] = useState([]);
  const [quantidadeSeteDias, setQuantidadeSeteDias] = useState(0);
  const [valorSeteDias, setValorSeteDias] = useState(0);
  const [arrayUltimos7Dias, setArrayUltimos7Dias] = useState<number[]>([]);
  const [arrayDataUltimos7Dias, setArrayDataUltimos7Dias] = useState([{}]);
  // const [arrayValorUltimosMeses, setArrayValorUltimosMeses] = useState([{}]);
  const [arrayValorUltimosMeses, setArrayValorUltimosMeses] = useState<number[]>([]);
  const [arrayDataUltimosMeses, setArrayDataUltimosMeses] = useState([{}]);
  const [quantidadeDia, setQuantidadeDia] = useState(0);
  const [valorDia, setValorDia] = useState(0);

  const url = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  const obterEmpresa = async () => {
    try {
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/${url}/databases/(default)/documents/usuarios/${usuario?.uid}/empresa`
      )

      const empresaData = response.data.documents
      setNome(empresaData[0].fields.nome?.stringValue)     
    } catch (error) {
      console.error('Erro ao obter produtos:', error)
    }
  }

  const obterEstatisticasVendas = async () => {
    const obterQuantidadeEValor = async (filtroInicio, filtroFim) => {
      try {
        const db = firebase.firestore();
  
        // Converta as datas para o formato Timestamp do Firebase
        const timestampInicio = firebase.firestore.Timestamp.fromDate(filtroInicio);
        const timestampFim = firebase.firestore.Timestamp.fromDate(filtroFim);
  
        // Construa a consulta
        const querySnapshot = await db.collection('usuarios').doc(usuario?.uid).collection('vendas')
          .where('dataHoraEnvio', '>=', timestampInicio)
          .where('dataHoraEnvio', '<=', timestampFim)
          .get();
  
        const documentos = querySnapshot.docs;
        const quantidade = documentos.length;
        const valorTotal = documentos.reduce((total, doc) => {
          const valor = parseFloat(doc.data().total) || 0; // Converte para número
          return total + valor;
        }, 0);
  
        return { quantidade, valorTotal, documentos };
      } catch (error) {
        console.error('Erro ao obter quantidade e valor:', error);
        throw error;
      }
    };
  
    try {
      // Estatísticas do dia
      const dataAtual = new Date();
      dataAtual.setHours(0, 0, 0, 0);
      const estatisticasDia = await obterQuantidadeEValor(dataAtual, new Date());
  
      // Estatísticas dos últimos 7 dias
      const dataAtual7Dias = new Date();
      const dataInicioUltimos7Dias = new Date();
      dataInicioUltimos7Dias.setDate(dataInicioUltimos7Dias.getDate() - 7);
      const estatisticasUltimos7Dias = await obterQuantidadeEValor(dataInicioUltimos7Dias, dataAtual7Dias);
  
      // Somar os valores totais por dia nos últimos 7 dias
      const arrayUltimos7Dias = Array.from({ length: 7 }, (_, index) => {
        const dataDia = new Date();
        dataDia.setDate(dataDia.getDate() - index);
        dataDia.setHours(0, 0, 0, 0);
        const filtroInicioDia = dataDia;
        const filtroFimDia = new Date(dataDia);
        filtroFimDia.setHours(23, 59, 59, 999);
        const totalDia = estatisticasUltimos7Dias.documentos.reduce((total, doc) => {
          const valor = parseFloat(doc.data().total) || 0;
          const dataEnvio = doc.data().dataHoraEnvio.toDate();
          if (dataEnvio >= filtroInicioDia && dataEnvio <= filtroFimDia) {
            return total + valor;
          }
          return total;
        }, 0);
        return parseFloat(totalDia.toFixed(2)); // Arredonda para 2 casas decimais
      });

      // Obter as datas formatadas no formato dd/mm/AAAA
      const arrayDataUltimos7Dias = Array.from({ length: 7 }, (_, index) => {
        const dataDia = new Date();
        dataDia.setDate(dataDia.getDate() - index);
        return dataDia.toLocaleDateString('pt-BR');
      });

      // Estatísticas dos últimos 6 meses
      const arrayValorUltimosMeses = Array.from({ length: 6 }, (_, index) => {
        const dataInicioMes = new Date();
        dataInicioMes.setMonth(dataInicioMes.getMonth() - index, 1);
        dataInicioMes.setHours(0, 0, 0, 0); // Ajuste para considerar desde a primeira hora do dia
        const dataFimMes = new Date(dataInicioMes.getFullYear(), dataInicioMes.getMonth() + 1, 0, 23, 59, 59, 999);
        const totalMes = estatisticasUltimos7Dias.documentos.reduce((total, doc) => {
          const valor = parseFloat(doc.data().total) || 0;
          const dataEnvio = doc.data().dataHoraEnvio.toDate();
          if (dataEnvio >= dataInicioMes && dataEnvio <= dataFimMes) {
            return total + valor;
          }
          return total;
        }, 0);
        return parseFloat(totalMes.toFixed(2)); // Arredonda para 2 casas decimais
      });

      // Obter os nomes dos últimos 6 meses
      const arrayDataUltimosMeses = Array.from({ length: 6 }, (_, index) => {
        const dataMes = new Date();
        dataMes.setMonth(dataMes.getMonth() - index);
        return dataMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      });
  
      // Adicione aqui chamadas semelhantes para as outras estatísticas desejadas
  
      setQuantidadeDia(estatisticasDia.quantidade);
      setValorDia(estatisticasDia.valorTotal);
      setQuantidadeSeteDias(estatisticasUltimos7Dias.quantidade);
      setValorSeteDias(estatisticasUltimos7Dias.valorTotal);
      setArrayUltimos7Dias(arrayUltimos7Dias);
      setArrayDataUltimos7Dias(arrayDataUltimos7Dias);
      setArrayValorUltimosMeses(arrayValorUltimosMeses);
      setArrayDataUltimosMeses(arrayDataUltimosMeses);
      console.log('Array Datas: ', arrayDataUltimos7Dias)
  
    } catch (error) {
      console.error('Erro ao obter estatísticas de vendas:', error);
    }
  };

  
  
  // setQuantidadeSeteDias(estatisticasUltimos7Dias.quantidade)
  // Chame a função principal
  useEffect(() => {
    obterEstatisticasVendas()
    if (usuario) {
      obterEmpresa()
    }
    console.log('TESTE QUANTIDADE DIA', quantidadeDia)
    console.log('TESTE VALOR DIA', valorDia)
    console.log('TESTE QTDADE 7 DIAS', quantidadeSeteDias)
    console.log('TESTE VALOR 7 DIAS', valorSeteDias)
    console.log('TESTE VALOR 6 MESES', arrayValorUltimosMeses)
  },[usuario])

  const option = {
    chart: {
      id: 'apexchart-example'
    },
    xaxis: {
      categories: arrayDataUltimos7Dias
    }
  }
  const optionMeses = {
    chart: {
      id: 'apexchart-example'
    },
    xaxis: {
      categories: arrayDataUltimosMeses
    }
  }

  const series = [{
      name: 'Valor',
      data: arrayUltimos7Dias
    }]
  const seriesMeses = [{
      name: 'Valor',
      data: arrayValorUltimosMeses
    }]

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
      <LayoutConteudo titulo="Painel de controle">

      <div className="flex flex-wrap">
        
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
          <div className="bg-[#f9a11b] text-white p-6 rounded-md">
            <span>Valor de hoje:</span>
            <p className="text-2xl">R$ {valorDia}</p>
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
          <div className="bg-[#f9a11b] text-white p-6 rounded-md">
            <span>Quantidade de vendas hoje:</span>
            <p className="text-2xl">{quantidadeDia}</p>
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
          <div className="bg-[#f9a11b] text-white p-6 rounded-md">
            <span>Qtd vendas 7 dias:</span>
            <p className="text-2xl">{quantidadeSeteDias}</p>
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
          <div className="bg-[#f9a11b] text-white p-6 rounded-md">
            <span>Valor vendas 7 dias:</span>
            <p className="text-2xl">R$ {valorSeteDias}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        
        <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
          <div className="bg-gray-200 p-6 rounded-md">
            <span>Valor das vendas - 7 dias</span>            
          <ApexChart type="bar" options={option} series={series} height={240} />
          </div>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
          <div className="bg-gray-200 p-6 rounded-md">
            <span>Valor das vendas - 6 meses</span>            
          <ApexChart type="bar" options={optionMeses} series={seriesMeses} height={240} />
          </div>
        </div>
        
        {/* <div className="w-full p-4">
          <div className="bg-gray-200 p-6 rounded-md">
            
            Div 4
          </div>
        </div> */}
      </div>

      </LayoutConteudo>
      </div>
    </Layout>
  )
}
