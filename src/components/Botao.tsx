interface BotaoProps {
  cor?: 'green' | 'blue' | 'gray'
  className?: string
  children: any
  onClick?: () => void
}

export default function Botao(props: BotaoProps) {
  const cor = props.cor ?? 'gray'
  return (
    <button
      onClick={props.onClick}
      className={`
            bg-${cor}-400 hover:bg-${cor}-600 
            rounded-md px-4 py-2 text-white 
            ${props.className}
        `}
    >
      {props.children}
    </button>
  )
}
