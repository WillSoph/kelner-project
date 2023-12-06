import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { AppProvider } from '../data/context/AppContext'
import { AuthProvider } from '../data/context/AuthContext'
import { TotalAcessibleProvider } from '../data/context/TotalAcessibleContext'
import OrderProvider from '../contexts/OrderProvider';
import { ModalProvider } from 'react-modal-hook';


function MyApp({ Component, pageProps }) {
  return (
    <TotalAcessibleProvider>
    <AuthProvider>
      <OrderProvider>
      <ModalProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </ModalProvider>
      </OrderProvider>
    </AuthProvider>
    </TotalAcessibleProvider>
  )
}

export default MyApp
