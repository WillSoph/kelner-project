import Titulo from './Titulo'
import BotaoAlternarTema from './BotaoAlternarTema'
import useAppData from '../../data/hook/useAppData'
import AvatarUsuario from './AvatarUsuario'
import useAuth from '../../data/hook/useAuth'

interface CabecalhoProps {
    titulo: string
    subtitulo: string
}

export default function Cabecalho(props: CabecalhoProps) {
    const { tema, alternarTema } = useAppData()
    const { usuario } = useAuth()

    return (
        <div className={`flex`}>
            <Titulo titulo={props.titulo} subtitulo={props.subtitulo} />
            <div className={`flex flex-grow justify-end items-center`}>
                <BotaoAlternarTema tema={tema} alternarTema={alternarTema} />                
                {/* <AvatarUsuario className="ml-3" />
                <p>Olá {usuario?.nome}</p> */}
            </div>
        </div>
    )
}