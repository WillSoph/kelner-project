import React from 'react'
import Navbar from '../cardapio/components/Navbar'
import OrderCard from '../../components/PlaceOrder/OrderCard'
import OrderPrice from '../../components/PlaceOrder/OrderPrice'
import { useOrder } from '../../contexts/OrderProvider'
import { useRouter } from 'next/router'
import Back from '../../routes/Back'

const PlaceOrderScreen = () => {
  const { order, setOrder } = useOrder()

  console.log(order)

  return (
    <>
      <Navbar />
      <main className="banner h-screen bg-amber-50 bg-opacity-50">
        <div className="mx-auto max-w-screen-xl px-6 py-20">
          <Back />
          {order.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2">
                
                <div className="col-span-1">
                  <div className="glass box-border rounded-lg p-6">
                    

                    <div className=" orderContainer flex h-full flex-col space-y-3 overflow-y-scroll ">
                      {order.map((item) => (
                        <OrderCard key={item.id} {...item} />
                      ))}
                    </div>
                    
                    <OrderPrice {...order} />
                    
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="pt-24">
              <h1 className="text-primary poppins text-center text-5xl">
                Nenhum pedido adicionado.
              </h1>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default PlaceOrderScreen
