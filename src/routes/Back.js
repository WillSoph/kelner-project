import React from 'react';
import { useRouter } from 'next/router';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

const Back = () => {
  const router = useRouter();

  return (
    <div className="relative top-8">
      <span
        onClick={() => router.back()}
        className="hover:underline poppins text-gray-700 select-none flex items-center space-x-2 cursor-pointer"
      >
        <MdOutlineKeyboardBackspace /> <span>Voltar</span>
      </span>
    </div>
  );
};

export default Back;