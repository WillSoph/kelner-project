import React from 'react'
import { useRouter } from 'next/router'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'

const Back = () => {
  const router = useRouter()

  return (
    <div className="relative top-8">
      <span
        onClick={() => router.back()}
        className="poppins flex cursor-pointer select-none items-center space-x-2 text-gray-700 hover:underline"
      >
        <MdOutlineKeyboardBackspace /> <span>Voltar</span>
      </span>
    </div>
  )
}

export default Back
