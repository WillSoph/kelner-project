import Image from 'next/image'
import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { useOrder } from '../../contexts/OrderProvider'

const OrderCard = (props) => {
  // const copyObj = {...props}
  // const [quantity, setQuantity] = useState(props.quantity);
  const { removeOrder } = useOrder()

  return (
    <div className=" flex space-x-3 rounded-lg p-4">
      <div className="flex">
        <img
          width={96}
          height={96}
          className="w-24 object-contain"
          src={props.fields.imagemUrl?.stringValue}
          alt=""
        />
      </div>
      <div className="flex flex-grow flex-col space-y-3">
        <h5 className="poppins text-base text-gray-700">
          {props.fields.nome?.stringValue}
        </h5>
        <h1 className="text-lg font-semibold text-orange-500">
          R$ {parseFloat(props.fields.preco?.stringValue).toFixed(2)}
        </h1>
        <p className="poppins text-sm text-gray-400">
          {props.fields.categoria?.stringValue}
        </p>
      </div>

      <div className="flex items-center space-x-3 px-4 py-2">
        <span className="poppins select-none text-lg text-gray-700">
          {props.quantity} itens
        </span>
      </div>
      {/*  quantity 
            <div className="flex items-center px-4 py-2 space-x-3">
                <AiOutlineMinus
                    onClick={() => {
                        quantity === 1 ? setQuantity(1) : setQuantity(quantity - 1);
                        copyObj.price = props.price * quantity

                    }}
                    className="text-2xl bg-primary w-8 h-8 rounded-full text-white hover:scale-105 transform transition duration-500 cursor-pointer p-1" />
                <span className="text-lg text-gray-700 poppins select-none">{quantity}</span>
                <AiOutlinePlus
                    onClick={() => {
                        setQuantity(quantity + 1);
                        copyObj.quantity = quantity;
                        // copyObj.price = copyObj.price * quantity;
                        // console.log(props)

                    }}
                    className="text-2xl bg-primary w-8 h-8 rounded-full text-white hover:scale-105 transform transition duration-500 cursor-pointer p-1" /> 
            </div>*/}

      {/* remove button  */}
      <div className="flex flex-col items-center justify-center">
        <AiOutlineDelete
          className="h-6 w-6 transform cursor-pointer text-gray-600 transition duration-500 hover:scale-105"
          onClick={() => removeOrder(props.fields.nome?.stringValue)}
        />
      </div>
    </div>
  )
}

export default OrderCard
