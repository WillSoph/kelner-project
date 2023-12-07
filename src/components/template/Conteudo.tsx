interface ConteudoProps {
  children?: any
}

export default function Conteudo(props: ConteudoProps) {
  return (
    <div
      className={`
            mt-7 flex h-screen
            flex-col dark:text-gray-200
        `}
    >
      {props.children}
    </div>
  )
}
