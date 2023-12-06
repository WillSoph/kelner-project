"use client"
import React, { createContext, useContext, useState } from 'react';

export const OrderContext = createContext();

export const useOrder = () => {
    return useContext(OrderContext)
}

const OrderProvider = ({ children }) => {
    const [order, setOrder] = useState([]);
    const [clientes, setClientes] = useState([]); // Adicionei o estado para os clientes

    // add order function 
    const handleOrder = (food) => {
        setOrder((prevValue) => {
            return [
                ...prevValue,
                food, 
            ]
        })
    }

    // remove order from cart 
    const removeOrder = (id) => {
        setOrder((prev) => {
            return prev.filter(item => {
                return item.fields.nome?.stringValue !== id
            })
        })
    }

    // Adicionei uma função para setar os clientes no contexto
    const setClientData = (clientData) => {
        setClientes(clientData);
    }

    const value = {
        setOrder,
        order,
        handleOrder,
        removeOrder,
        clientes, // Adicionei os clientes ao contexto
        setClientData, // Adicionei a função para setar os clientes
    }

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderProvider