import Link from 'next/link'

interface MenuItemProps {
  texto: string
  icone: any
  url?: string
  className?: string
  onClick?: (evento: any) => void
}

export default function MenuItem(props: MenuItemProps) {
  function renderizarLink() {
    return (
      <Link
        className={`
                    flex h-20 w-20 flex-col
                    items-center justify-center text-center 
                    dark:text-gray-200
                    ${props.className}
                `}
        href=""
      >
        {props.icone}
        <span className={`text-xs font-light`}>{props.texto}</span>
      </Link>
    )
  }
  return (
    <li
      onClick={props.onClick}
      className={`
            cursor-pointer hover:bg-gray-100
            dark:hover:bg-gray-800
        `}
    >
      {props.url ? (
        <Link href={props.url}>{renderizarLink()}</Link>
      ) : (
        renderizarLink()
      )}
    </li>
  )
}
