import TituloConteudo from "./TituloConteudo"

interface LayoutConteudoProps {
    titulo: string
    children: any
}

export default function LayoutConteudo(props: LayoutConteudoProps) {
    return (
        <div className={`
            flex flex-col w-full h-full
            bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md
        `}>
            <TituloConteudo>{props.titulo}</TituloConteudo>
            <div className="p-6">
                {props.children}
            </div>
        </div>
    )
}