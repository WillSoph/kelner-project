import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { AppProvider } from '../data/context/AppContext'
import { AuthProvider } from '../data/context/AuthContext'
import { TotalAcessibleProvider } from '../data/context/TotalAcessibleContext'
import OrderProvider from '../contexts/OrderProvider'
import { ModalProvider } from 'react-modal-hook'
import '../styles/globals.css'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <TotalAcessibleProvider>
      <AuthProvider>
        <OrderProvider>
          <ModalProvider>
            <AppProvider>
              <html lang="en">
                <body>
                  <div className="lg:grid-cols-app relative min-h-screen dark:bg-zinc-900 lg:grid">
                    <main className="max-w-screen px-4 pb-12 pt-24 lg:col-start-2 lg:w-auto lg:px-8 lg:pt-8">
                      {children}
                    </main>
                  </div>
                </body>
              </html>
            </AppProvider>
          </ModalProvider>
        </OrderProvider>
      </AuthProvider>
    </TotalAcessibleProvider>
  )
}
