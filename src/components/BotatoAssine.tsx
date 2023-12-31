import Cookies from 'js-cookie'
import useAuth from '../data/hook/useAuth'
import { api } from '../services/api'
import { getStripeJs } from '../services/stripe-js'

interface BotaoAssineProps {
  cor?: 'green' | 'blue' | 'gray'
  className?: string
  children: any
  onClick?: () => void
  priceId: string
}

export default function BotaoAssine(props: BotaoAssineProps) {
  const { 
    cadastrar, 
    login, 
  } = useAuth()

  async function handleSubscribe() {
    if (!Cookies.get('admin-template-cod3r-auth')) {
      login
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err.message)
    }
  }

  const cor = props.cor ?? 'gray'
  return (
    <button
      onClick={handleSubscribe}
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
