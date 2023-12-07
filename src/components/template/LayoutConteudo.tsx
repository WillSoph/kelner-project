import TituloConteudo from './TituloConteudo'

interface LayoutConteudoProps {
  titulo: string
  children: any
}

export default function LayoutConteudo(props: LayoutConteudoProps) {
  return (
    <div
      className={`
            flex h-full w-full flex-col
            rounded-md bg-white text-gray-800 dark:bg-gray-800 dark:text-white
        `}
    >
      <TituloConteudo>{props.titulo}</TituloConteudo>
      <div className="p-6">{props.children}</div>
    </div>
  )
}
