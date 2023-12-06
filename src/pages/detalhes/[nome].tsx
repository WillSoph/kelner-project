import React, { useState, useEffect } from "react";
// import axios from 'axios'
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import { useRouter } from "next/router";
import { withSwal } from "react-sweetalert2";
import { useOrder } from "../../contexts/OrderProvider";
import Back from "../../routes/Back";
import Navbar from "../cardapio/components/Navbar";
import Image from "next/image";

const FoodDetailScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { nome } = router.query;
  const [disabled, setDisabled] = useState(false);
  const { clientes } = useOrder();
  const { handleOrder } = useOrder();

  return (
    <>
      <main className="max-w-screen-xl mx-auto px-6 my-24">
        <Navbar />
        <Back />
        {clientes
          ?.filter((item) => item.fields.nome?.stringValue === nome)
          ?.map((cliente) => (
            <div
              className="flex flex-col justify-center items-center mt-12"
              key={cliente.createTime}
            >
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10"
                key={cliente.createTime}
              >
                {/* left side  */}
                <div className="order-2 md:order-1 lg:order-1 flex flex-col justify-center">
                  <h1 className="text-center md:text-left lg:text-left text-3xl lg:text-4xl font-semibold poppins pb-4 text-gray-700 select-none">
                    {cliente.fields.nome?.stringValue || "Nome Indisponível"}
                  </h1>
                  <p className="text-center md:text-left lg:text-left text-sm poppins text-gray-500 leading-relaxed select-none">
                    {cliente.fields.descricao?.stringValue ||
                      "Descrição indisponível"}
                  </p>

                  {/* price and quantity  */}
                  <div className="flex items-center justify-center md:justify-start lg:justify-start space-x-6 pt-8">
                    <h1 className="text-3xl font-bold text-black select-none">
                      R$
                      {(cliente.fields.preco?.stringValue * quantity).toFixed(
                        2,
                      )}
                    </h1>
                    {/* quantity  */}
                    <div className="flex items-center border border-gray-200 px-4 py-2 space-x-6 rounded-full">
                      <AiOutlineMinus
                        onClick={() => {
                          quantity === 1
                            ? setQuantity(1)
                            : setQuantity(quantity - 1);
                        }}
                        className="text-2xl bg-orange-500 w-8 h-8 rounded-full text-white hover:scale-105 transform transition duration-500 cursor-pointer p-1"
                      />
                      <span className="text-lg text-gray-700 select-none">
                        {quantity}
                      </span>

                      <AiOutlinePlus
                        onClick={() => {
                          setQuantity(quantity + 1);
                        }}
                        className="text-2xl bg-orange-500 w-8 h-8 rounded-full text-white hover:scale-105 transform transition duration-500 cursor-pointer p-1"
                      />
                    </div>
                  </div>

                  {/* add button  */}
                  <div className="mt-8 flex items-center justify-center md:justify-start lg:justify-start">
                    <button
                      disabled={disabled}
                      className={
                        disabled
                          ? "opacity-30 flex items-center space-x-3 bg-orange-500 px-6 py-3 text-white rounded-full ring-red-300 focus:outline-none focus:ring-4 transform transition duration-700 hover:scale-105"
                          : "flex items-center space-x-3 bg-orange-500 px-6 py-3 text-white poppins rounded-full ring-red-300 focus:outline-none focus:ring-4 transform transition duration-700 hover:scale-105"
                      }
                      onClick={() => {
                        cliente["quantity"] = quantity;
                        cliente.price = cliente.preco * quantity;
                        handleOrder(cliente);
                        setDisabled(true);
                        withSwal({
                          title: "Wow!!!",
                          text: "Your order has added to the cart",
                          icon: "success",
                        });
                        router.push("/orders");
                        console.log(cliente);
                      }}
                    >
                      <BsCart2 className="text-xl" />
                      <span>
                        {disabled ? "Adicionado" : "Adicionar ao pedido"}
                      </span>
                    </button>
                  </div>
                </div>
                {/* right side  */}
                <div className="order-1 md:order-2 lg:order-2">
                  <img
                    src={cliente.fields.imagemUrl?.stringValue}
                    className="w-3/4 md:w-3/4 lg:w-full mx-auto"
                    alt="food"
                  />
                </div>
              </div>
            </div>
          ))}
      </main>
    </>
  );
};

export default FoodDetailScreen;
