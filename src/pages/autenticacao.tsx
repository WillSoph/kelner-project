import { GetStaticProps } from 'next'

import Link from 'next/link'
import { useState } from 'react'
import { stripe } from '../services/stripe'
import AuthInput from '../components/auth/AuthInput'
import { IconeAtencao } from '../components/icons'
import useAuth from '../data/hook/useAuth'
import BotaoAssine from '../components/BotatoAssine'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

export default function Autenticacao({ product }: HomeProps) {
  const { 
    cadastrar, 
    login,
    loginAutenticado 
  } = useAuth()

  const [erro, setErro] = useState(null)
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function exibirErro(msg, tempoEmSegundos = 5) {
    setErro(msg)
    setTimeout(() => setErro(null), tempoEmSegundos * 1000)
  }

  async function submeter() {
    try {
      if (modo === 'login' && loginAutenticado) {
        await loginAutenticado(email, senha);
      } else if (modo === 'cadastro' && cadastrar) {
        await cadastrar(email, senha);
      } else {
        throw new Error('Função de autenticação não encontrada.');
      }
    } catch (e) {
      exibirErro(e?.message ?? 'Erro desconhecido!');
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="hidden md:block md:w-1/2 lg:w-2/3">
        <img
          width={100}
          height={100}
          src="https://images.unsplash.com/photo-1682695795557-17447f921f79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Imagem da Tela de Autenticação"
          className="h-screen w-full object-cover"
        />
      </div>
      <div className="m-10 w-full md:w-1/2 lg:w-1/3">
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

        {/* {modo === 'cadastro' && (
          <AuthInput
            label="Nome"
            tipo="text"
            valor={nome}
            valorMudou={setNome}
            obrigatorio
          />
        )} */}
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
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //teste
  // const price = await stripe.prices.retrieve('price_1O0UrrIYJ05oSoaZonPhWe4G')

  //prod
  const price = await stripe.prices.retrieve('price_1Oo2DfIYJ05oSoaZfYGQULt1')

  if (!price || price.unit_amount === null) {
    // Lida com a situação em que price ou price.unit_amount é nulo
    throw new Error('Não foi possível obter o preço ou o valor do preço é nulo.');
  }

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}
