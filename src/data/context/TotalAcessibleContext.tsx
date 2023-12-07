'use client'
import { createContext, ReactNode, useContext, useState } from 'react'

type TotalAcessibleContextType = {
  totalAcessible: boolean | null
  setTotalAcessible: (value: boolean) => void
}

const TotalAcessibleContext = createContext<
  TotalAcessibleContextType | undefined
>(undefined)

export function TotalAcessibleProvider({ children }: { children: ReactNode }) {
  const [totalAcessible, setTotalAcessible] = useState<boolean | null>(null)
  console.log('acessivel 2: ', totalAcessible)
  return (
    <TotalAcessibleContext.Provider
      value={{ totalAcessible, setTotalAcessible }}
    >
      {children}
    </TotalAcessibleContext.Provider>
  )
}

export function useTotalAcessible() {
  const context = useContext(TotalAcessibleContext)
  if (!context) {
    throw new Error(
      'useTotalAcessible must be used within a TotalAcessibleProvider',
    )
  }
  return context
}
