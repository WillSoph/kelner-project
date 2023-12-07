import useAuth from '../../data/hook/useAuth'
import { IconeAjustes, IconeCasa, IconeSair, IconeSino } from '../icons'
import Logo from './Logo'
import MenuItem from './MenuItem'

export default function MenuLateral() {
  const { logout } = useAuth()

  return (
    <aside
      className={`
            flex flex-col
            bg-gray-200 text-gray-700
            dark:bg-gray-900
        `}
    >
      <div
        className={`
                flex h-20 w-20 flex-col
                items-center justify-center bg-gradient-to-r
                from-orange-500 to-orange-800
            `}
      >
        <Logo />
      </div>
      <ul className="flex-grow">
        <MenuItem url="/" texto="Início" icone={IconeCasa} />
        {/* <MenuItem url="/ajustes" texto="Ajustes" icone={IconeAjustes} />
                <MenuItem url="/notificacoes" texto="Notificações" icone={IconeSino} /> */}
      </ul>
      <ul>
        <MenuItem
          texto="Sair"
          icone={IconeSair}
          onClick={logout}
          className={`
                        text-red-600 hover:bg-red-400
                        hover:text-white dark:text-red-400
                        dark:hover:text-white
                    `}
        />
      </ul>
    </aside>
  )
}
