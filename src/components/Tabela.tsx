import { useEffect, useState } from 'react'
import Cliente from '../core/Cliente'
import { IconeEdicao, IconeLixo } from './icons'

interface FiltroCategoriaProps {
  categorias: string[]
  categoriaSelecionada: string
  onCategoriaSelecionada: (categoria: string) => void
}

function FiltroCategoria(props: FiltroCategoriaProps) {
  return (
    <div className="flex space-x-2">
      {props.categorias.map((categoria) => (
        <button
          key={categoria}
          onClick={() => props.onCategoriaSelecionada(categoria)}
          className={`mb-2 rounded px-4 py-2 ${
            props.categoriaSelecionada === categoria
              ? 'bg-orange-500 text-white'
              : 'border-2 border-orange-500 bg-white text-gray-700'
          }`}
        >
          {categoria}
        </button>
      ))}
    </div>
  )
}

interface TabelaProps {
  clientes: Cliente[]
  clienteSelecionado?: (cliente: Cliente) => void
  clienteExcluido?: (cliente: Cliente) => void
}

export default function Tabela(props: TabelaProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas')

  const categorias = [
    ...new Set(props.clientes.map((cliente) => cliente.categoria)),
  ]

  const clientesFiltrados =
    categoriaSelecionada === 'Todas'
      ? props.clientes
      : props.clientes.filter(
          (cliente) => cliente.categoria === categoriaSelecionada,
        )

  clientesFiltrados.sort((a, b) => a.nome.localeCompare(b.nome))

  const exibirAcoes = props.clienteExcluido || props.clienteSelecionado

  function renderizarCabecalho() {
    return (
      <tr>
        {/* <th className="text-left p-4">Código</th> */}
        <th className="p-4 text-left">Nome</th>
        <th className="p-4 text-left">Categoria</th>
        <th className="p-4 text-left">Descrição</th>
        <th className="p-4 text-left">Preço</th>
        {exibirAcoes ? <th className="p-4">Ações</th> : false}
      </tr>
    )
  }

  useEffect(() => {
    renderizarDados()
  }, [clientesFiltrados])

  function renderizarDados() {
    return clientesFiltrados?.map((cliente, i) => {
      return (
        <tr
          key={cliente.id}
          className={`${i % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
        >
          {/* <td className="text-left p-4">{cliente.id}</td> */}
          <td className="p-4 text-left text-stone-800">{cliente.nome}</td>
          <td className="p-4 text-left text-stone-800">{cliente.categoria}</td>
          <td className="p-4 text-left text-stone-800">
            {cliente.descricao?.length > 50
              ? `${cliente.descricao?.substring(0, 50)}...`
              : cliente.descricao?.length <= 0
                ? 'Sem descrição'
                : cliente.descricao}
          </td>
          <td className="p-4 text-left text-stone-800">{cliente.preco}</td>
          {exibirAcoes ? renderizarAcoes(cliente) : false}
        </tr>
      )
    })
  }

  function renderizarAcoes(cliente: Cliente) {
    return (
      <td className="flex justify-center">
        {props.clienteSelecionado ? (
          <button
            onClick={() => props.clienteSelecionado?.(cliente)}
            className={`
                        m-1 flex items-center 
                        justify-center rounded-full p-2 text-green-600
                        hover:bg-purple-50
                    `}
          >
            {IconeEdicao(16)}
          </button>
        ) : (
          false
        )}
        {props.clienteExcluido ? (
          <button
            onClick={() => props.clienteExcluido?.(cliente)}
            className={`
                    m-1 flex items-center 
                    justify-center rounded-full p-2 text-red-500
                    hover:bg-purple-50
                `}
          >
            {IconeLixo(16)}
          </button>
        ) : (
          false
        )}
      </td>
    )
  }

  return (
    <div className="overflow-x-auto">
      <FiltroCategoria
        categorias={['Todas', ...categorias]}
        categoriaSelecionada={categoriaSelecionada}
        onCategoriaSelecionada={setCategoriaSelecionada}
      />
      <table className="w-full overflow-hidden rounded-xl">
        <thead
          className={`
                    bg-gray-500
                     text-gray-100
                `}
        >
          {renderizarCabecalho()}
        </thead>
        <tbody>{renderizarDados()}</tbody>
      </table>
    </div>
  )
}
