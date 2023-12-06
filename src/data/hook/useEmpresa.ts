import { useRouter } from 'next/router';
import { useEffect, useState } from "react"
import Empresa from "../../core/Empresa"
import EmpresaRepositorio from "../../core/EmpresaRepositorio"
import ColecaoEmpresa from "../../firebase/db/ColecaoEmpresa"
import useTabelaOuForm from "./useTabelaOuForm"

export default function useEmpresas() {
    const repo: EmpresaRepositorio = new ColecaoEmpresa()
    const router = useRouter();

    const { tabelaVisivel, exibirTabela, exibirFormulario } = useTabelaOuForm()

    const [empresa, setEmpresa] = useState<Empresa>(Empresa.vazio())
    const [empresas, setEmpresas] = useState<Empresa[]>([])
  
    useEffect(obterTodos,[])
  
    function obterTodos() {
      repo.obterTodos().then(empresas => {
        setEmpresas(empresas)
      })
    }
  
    function selecionarEmpresa(empresa: Empresa) {
      setEmpresa(empresa)
      exibirFormulario()
    }
  
    async function excluirEmpresa(empresa: Empresa) {
      await repo.excluir(empresa)
      obterTodos()
    }
  
    function novoEmpresa() {
      setEmpresa(Empresa.vazio())
      exibirFormulario()
    }
    async function salvarEmpresa(empresa: Empresa) {
      await repo.salvar(empresa)      
      router.push('/painel')
      console.log('salvar empresa',empresa)
    }

    return {        
        empresa,
        empresas,
        novoEmpresa,
        salvarEmpresa,
        excluirEmpresa,
        selecionarEmpresa,
        obterTodos,
        tabelaVisivel,
        exibirTabela
    }
}