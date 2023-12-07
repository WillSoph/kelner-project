'use client'
import React, { createContext, useContext, useState } from 'react'

export const OrderContext = createContext()

export const useOrder = () => {
  return useContext(OrderContext)
}

const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([])
  const [clientes, setClientes] = useState([])

  
  const handleOrder = (food) => {
    setOrder((prevValue) => {
      return [...prevValue, food]
    })
  }

  
  const removeOrder = (id) => {
    setOrder((prev) => {
      return prev.filter((item) => {
        return item.fields.nome?.stringValue !== id
      })
    })
  }

  
  const setClientData = (clientData) => {
    setClientes(clientData)
  }

  const value = {
    setOrder,
    order,
    handleOrder,
    removeOrder,
    clientes, 
    setClientData,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export default OrderProvider
