import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

const FoodItem = ({ imagemUrl, nome, descricao, preco, categoria }) => {
  const router = useRouter()

  const handleRoute = () => {
    router.push(`../detalhes/${nome}`)
  }

  return (
    <div className="relative transform rounded-lg border border-gray-100 bg-white p-4 transition duration-700 hover:scale-105 hover:shadow-xl">
      <span className="text-primary poppins mb-4 inline-block rounded-full border border-red-500 bg-red-100 px-4 py-1 text-sm">
        {categoria}
      </span>
      <img
        className="mx-auto w-64 transform rounded-md transition duration-300 hover:scale-105"
        src={imagemUrl}
        alt=""
      />
      <div className="my-3 flex flex-col items-center space-y-2">
        <h1 className="poppins text-lg text-gray-900">{nome}</h1>
        <p className="poppins text-center text-sm text-gray-500">
          {descricao?.slice(0, 50)}
        </p>
        <h2 className="poppins text-2xl font-bold text-gray-900">R$ {preco}</h2>
        <button
          className="inline-flex transform justify-center rounded-full bg-orange-600 px-8 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 hover:scale-105 hover:bg-orange-500 sm:ml-3 sm:w-auto"
          onClick={handleRoute}
        >
          Mais detalhes
        </button>
      </div>
    </div>
  )
}

export default FoodItem
