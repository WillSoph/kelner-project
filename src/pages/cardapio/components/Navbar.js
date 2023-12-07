import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { BsCart2 } from 'react-icons/bs'
import { useOrder } from '../../../contexts/OrderProvider'
import useAuth from '../../../data/hook/useAuth'

const Navbar = () => {
  const { usuario } = useAuth()
  const [changeHeader, setChangeHeader] = useState(false)
  const router = useRouter()
  const { order } = useOrder()
  const [empresa, setEmpresa] = useState([])

  const url = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  //header change function
  const onChangeHeader = () => {
    if (window.scrollY >= 50) {
      setChangeHeader(true)
    } else {
      setChangeHeader(false)
    }
  }

  //change header by scrolling
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', onChangeHeader)
  }

  useEffect(() => {
    if (usuario) {
      obterEmpresa()
    }
  }, [usuario])

  const obterEmpresa = async () => {
    try {
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/${url}/databases/(default)/documents/usuarios/${usuario?.uid}/empresa`,
      )

      const empresaData = response.data.documents
      setEmpresa(empresaData[0])
    } catch (error) {
      console.error('Erro ao obter empresa:', error)
    }
  }
  return (
    <header
      className={
        changeHeader
          ? 'fixed left-0 top-0 z-50 w-full bg-white shadow-md transition duration-500'
          : 'fixed left-0 top-0 z-50 w-full bg-transparent transition duration-500'
      }
    >
      <nav className="mx-auto flex max-w-screen-xl items-center px-6 py-3">
        {/* left  */}
        <div className="flex flex-grow items-center">
          <img
            src="/images/logo.svg"
            alt="N"
            width="32"
            height="32"
            className="w-8"
          />
          <p className="ml-4">{empresa.fields?.nome.stringValue}</p>
        </div>
        <div className="flex items-center justify-end space-x-6">
          <div
            className="relative flex cursor-pointer"
            onClick={() => router.push('/orders')}
          >
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">
              {order.length}
            </span>
            <BsCart2 className="h-6 w-6 cursor-pointer text-gray-700" />
          </div>
          {/* <button className=" bg-orange-500 px-6 py-3 text-white rounded-full ring-red-300 focus:outline-none focus:ring-4 transform transition duration-700 hover:scale-105" onClick={() => history.push('/signup')}>Sua lista</button> */}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
