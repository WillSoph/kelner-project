import React from 'react'
import Navbar from '../cardapio/components/Navbar'
import { withSwal } from 'react-sweetalert2'
// import DeliveryForm from '../components/PlaceOrder/DeliveryForm';
import OrderCard from '../../components/PlaceOrder/OrderCard'
import OrderPrice from '../../components/PlaceOrder/OrderPrice'
import { useDelivery } from '../../contexts/DeliveryProvider'
import { useOrder } from '../../contexts/OrderProvider'
import { useRouter } from 'next/router'
import Back from '../../routes/Back'

const PlaceOrderScreen = () => {
  const { order, setOrder } = useOrder()
  // const { input, disabled } = useDelivery();
  const router = useRouter()

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
                {/* left side form  */}
                {/* <div className="col-span-1">
                                <DeliveryForm />
                            </div> */}
                {/* right side  */}
                <div className="col-span-1">
                  <div className="glass box-border rounded-lg p-6">
                    {/* order details  */}
                    {/* <div className="flex flex-col space-y-4 mb-3">
                                        <p className="poppins text-gray-700">Deliver Place :  <span className="font-semibold text-black">{input.country ? `${input.country}` : '-----'}</span></p>
                                        <p className="poppins text-gray-700">Arriving in 20-30 min</p>
                                        <p className="poppins text-gray-700">Road <span className="font-semibold text-black">{input.roadNo ? `${input.roadNo}` : '-----'}</span> </p>
                                        <p className="poppins text-gray-700">Floor :  <span className="font-semibold text-black">{input.flatno ? `${input.flatno}` : '-----'}</span> </p>
                                        <p className="poppins text-gray-700">Deliver to :  <span className="font-semibold text-black">{input.name ? `${input.name}` : '-----'}</span> </p>
                                    </div> */}
                    {/* orders  */}

                    <div className=" orderContainer flex h-full flex-col space-y-3 overflow-y-scroll ">
                      {order.map((item) => (
                        <OrderCard key={item.id} {...item} />
                      ))}
                    </div>
                    {/* price  */}
                    <OrderPrice {...order} />
                    {/* place order button  */}
                    {/* <div>
                                        {disabled ? (
                                            <button disabled="disabled" className="w-full px-6 py-3 rounded-lg bg-primary text-white poppins ring-red-300 focus:ring-4 transition duration-500 opacity-40">Place Order</button>
                                        ) : (
                                            <button className="w-full px-6 py-3 rounded-lg bg-primary text-white poppins ring-red-300 focus:ring-4 transition duration-500" onClick={() => {
                                                withSwal("Congratulations!!!", `You have order ${order.length} times successfully`, "success")
                                                router.push('/order-successful');
                                                setOrder([]);
                                            }}>Place Order</button>
                                        )}

                                    </div> */}
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
