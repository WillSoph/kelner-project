import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { BsCart2 } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { withSwal } from 'react-sweetalert2'
import { useOrder } from '../../contexts/OrderProvider'
import Back from '../../routes/Back'
import Navbar from '../cardapio/components/Navbar'
import Image from 'next/image'

const FoodDetailScreen = () => {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { nome } = router.query
  const [disabled, setDisabled] = useState(false)
  const { clientes } = useOrder()
  const { handleOrder } = useOrder()

  return (
    <>
      <main className="mx-auto my-24 max-w-screen-xl px-6">
        <Navbar />
        <Back />
        {clientes
          ?.filter((item) => item.fields.nome?.stringValue === nome)
          ?.map((cliente) => (
            <div
              className="mt-12 flex flex-col items-center justify-center"
              key={cliente.createTime}
            >
              <div
                className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2"
                key={cliente.createTime}
              >
                {/* left side  */}
                <div className="order-2 flex flex-col justify-center md:order-1 lg:order-1">
                  <h1 className="poppins select-none pb-4 text-center text-3xl font-semibold text-gray-700 md:text-left lg:text-left lg:text-4xl">
                    {cliente.fields.nome?.stringValue || 'Nome Indisponível'}
                  </h1>
                  <p className="poppins select-none text-center text-sm leading-relaxed text-gray-500 md:text-left lg:text-left">
                    {cliente.fields.descricao?.stringValue ||
                      'Descrição indisponível'}
                  </p>

                  {/* price and quantity  */}
                  <div className="flex items-center justify-center space-x-6 pt-8 md:justify-start lg:justify-start">
                    <h1 className="select-none text-3xl font-bold text-black">
                      R$
                      {(cliente.fields.preco?.stringValue * quantity).toFixed(
                        2,
                      )}
                    </h1>
                    {/* quantity  */}
                    <div className="flex items-center space-x-6 rounded-full border border-gray-200 px-4 py-2">
                      <AiOutlineMinus
                        onClick={() => {
                          quantity === 1
                            ? setQuantity(1)
                            : setQuantity(quantity - 1)
                        }}
                        className="h-8 w-8 transform cursor-pointer rounded-full bg-orange-500 p-1 text-2xl text-white transition duration-500 hover:scale-105"
                      />
                      <span className="select-none text-lg text-gray-700">
                        {quantity}
                      </span>

                      <AiOutlinePlus
                        onClick={() => {
                          setQuantity(quantity + 1)
                        }}
                        className="h-8 w-8 transform cursor-pointer rounded-full bg-orange-500 p-1 text-2xl text-white transition duration-500 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* add button  */}
                  <div className="mt-8 flex items-center justify-center md:justify-start lg:justify-start">
                    <button
                      disabled={disabled}
                      className={
                        disabled
                          ? 'flex transform items-center space-x-3 rounded-full bg-orange-500 px-6 py-3 text-white opacity-30 ring-red-300 transition duration-700 hover:scale-105 focus:outline-none focus:ring-4'
                          : 'poppins flex transform items-center space-x-3 rounded-full bg-orange-500 px-6 py-3 text-white ring-red-300 transition duration-700 hover:scale-105 focus:outline-none focus:ring-4'
                      }
                      onClick={() => {
                        cliente['quantity'] = quantity
                        cliente.price = cliente.preco * quantity
                        handleOrder(cliente)
                        setDisabled(true)
                        withSwal({
                          title: 'Wow!!!',
                          text: 'Your order has added to the cart',
                          icon: 'success',
                        })
                        router.push('/orders')
                        console.log(cliente)
                      }}
                    >
                      <BsCart2 className="text-xl" />
                      <span>
                        {disabled ? 'Adicionado' : 'Adicionar ao pedido'}
                      </span>
                    </button>
                  </div>
                </div>
                {/* right side  */}
                <div className="order-1 md:order-2 lg:order-2">
                  <img
                    src={cliente.fields.imagemUrl?.stringValue}
                    className="mx-auto w-3/4 md:w-3/4 lg:w-full"
                    alt="food"
                  />
                </div>
              </div>
            </div>
          ))}
      </main>
    </>
  )
}

export default FoodDetailScreen
