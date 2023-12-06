import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const FoodItem = ({ imagemUrl, nome, descricao, preco, categoria }) => {
  const router = useRouter();

  const handleRoute = () => {
    router.push(`../detalhes/${nome}`);
  };

  return (
    <div className="bg-white border border-gray-100 transition transform duration-700 hover:shadow-xl hover:scale-105 p-4 rounded-lg relative">
      <span className="bg-red-100 border border-red-500 rounded-full text-primary text-sm poppins px-4 py-1 inline-block mb-4">
        {categoria}
      </span>
      <img className="w-64 mx-auto transform transition duration-300 hover:scale-105 rounded-md" src={imagemUrl} alt="" />
      <div className="flex flex-col items-center my-3 space-y-2">
        <h1 className="text-gray-900 poppins text-lg">{nome}</h1>
        <p className="text-gray-500 poppins text-sm text-center">{descricao?.slice(0, 50)}</p>
        <h2 className="text-gray-900 poppins text-2xl font-bold">R$ {preco}</h2>
        <button
          className="inline-flex justify-center bg-orange-600 rounded-full px-8 py-2 text-sm font-semibold text-white shadow-sm transform transition duration-300 hover:scale-105 hover:bg-orange-500 sm:ml-3 sm:w-auto"
          onClick={handleRoute}
        >
          Mais detalhes
        </button>
      </div>
    </div>
  );
};

export default FoodItem;