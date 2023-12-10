import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Empresa from '../core/Empresa'
import Entrada from '../components/Entrada'
import { uploadImagem } from '../core/UploadImagem'
import useEmpresas from '../data/hook/useEmpresa'
import useAuth from '../data/hook/useAuth'
import { useTotalAcessible } from '../data/context/TotalAcessibleContext'
import Layout from '../components/template/Layout'
import LayoutConteudo from '../components/template/LayoutConteudo'

interface EmpresaFields {
  id?: {
    stringValue?: string;
  };
  nome?: {
    stringValue?: string;
  };
  imagemUrl?: {
    stringValue?: string;
  };
  // Adicione outras propriedades conforme necessário
}

interface EmpresaData {
  id?: string;
  fields?: EmpresaFields;
  // Adicione outras propriedades conforme necessário
}

interface EditarEmpresaProps {
  empresa: Empresa
  empresaMudou?: (empresa: EmpresaData) => void
  cancelado?: () => void
}

export default function Formulario(props: EditarEmpresaProps) {
  const { salvarEmpresa } = useEmpresas()
  const { usuario, carregando } = useAuth()
  const { totalAcessible, setTotalAcessible } = useTotalAcessible()
  const router = useRouter()
  const id = props.empresa?.id

  const isEdicao = props.empresa?.fields?.id
  const [empresa, setEmpresa] = useState<Empresa | null>(null) // Ajuste aqui
  const [nome, setNome] = useState(
    props.empresa?.fields?.nome?.stringValue || ''
  )
  const [imagem, setImagem] = useState<File | null>(null)
  const url = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  useEffect(() => {
    if (!totalAcessible) {
      router.push(`/`)
    }
  }, [totalAcessible])

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
      setEmpresa(empresaData[0]?.fields || null) // Ajuste aqui
      setNome(empresaData[0]?.fields?.nome?.stringValue || '')
    } catch (error) {
      console.error('Erro ao obter empresa:', error)
    }
  }

  const handleSalvar = async () => {
    let empresaComImagem: Empresa

    if (imagem instanceof File) {
      const urlImagem = await uploadImagem(imagem)
      empresaComImagem = new Empresa(nome, urlImagem, id)
    } else {
      const imagemUrl = empresa?.imagemUrl?.stringValue || '' // Ajuste aqui
      empresaComImagem = new Empresa(nome, imagemUrl, id)
    }

    salvarEmpresa(empresaComImagem)
  }

  const handleCancelar = () => {
    router.push('/painel')
  }

  return (
    <Layout titulo={empresa?.nome?.stringValue} subtitulo="">
      <div
        className={`
          border-1 flex h-full items-center 
          justify-center rounded-md border-gray-500 bg-gray-200 text-white
          dark:bg-gray-900
        `}
      >
        <LayoutConteudo titulo="Cadastro simples">
          {id ? (
            <Entrada
              somenteLeitura
              texto="Código"
              valor={id}
              className="mb-5"
            />
          ) : (
            false
          )}
          <Entrada
            texto="Nome"
            valor={nome}
            valorMudou={setNome}
            className="mb-5"
          />
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0] || null)}
            />
          </div>
          {empresa?.imagemUrl?.stringValue && (
            <img
              src={empresa?.imagemUrl?.stringValue}
              alt="Imagem do Cliente"
              className="mb-5 h-32 w-32 object-cover"
            />
          )}
          <div className="mt-7 flex justify-end">
            <button
              className="mr-2 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              onClick={handleSalvar}
            >
              {isEdicao ? 'Alterar' : 'Salvar'}
            </button>
            <button
              onClick={handleCancelar}
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