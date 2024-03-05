import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Vendas from '../../core/Vendas'
import VendasRepositorio from '../../core/VendasRepositorio'
import ColecaoVendas from '../../firebase/db/ColecaoVendas'
import useTabelaOuForm from './useTabelaOuForm'

export default function useVendas() {
  const repo: VendasRepositorio = new ColecaoVendas()
  const router = useRouter()

  const { tabelaVisivel, exibirTabela, exibirFormulario } = useTabelaOuForm()

  const [vendas, setVendas] = useState<Vendas>(Vendas.vazio())
  const [vendass, setVendass] = useState<Vendas[]>([])

  useEffect(obterTodos, [])

  function obterTodos() {
    repo.obterTodos().then((vendass) => {
      setVendass(vendass)
    })
  }

  function selecionarVendas(vendas: Vendas) {
    setVendas(vendas)
    exibirFormulario()
  }

  async function excluirVendas(vendas: Vendas) {
    await repo.excluir(vendas)
    obterTodos()
  }

  function novoVendas() {
    setVendas(Vendas.vazio())
    exibirFormulario()
  }
  async function salvarVendas(vendas: Vendas) {
    await repo.salvar(vendas)
    router.push('/dashboard')
    console.log('salvar venda', vendas)
  }

  return {
    vendas,
    vendass,
    novoVendas,
    salvarVendas,
    excluirVendas,
    selecionarVendas,
    obterTodos,
    tabelaVisivel,
    exibirTabela,
  }
}
