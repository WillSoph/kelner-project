import Image from "next/image";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useOrder } from "../../contexts/OrderProvider";

const OrderCard = (props) => {
  // const copyObj = {...props}
  // const [quantity, setQuantity] = useState(props.quantity);
  const { removeOrder } = useOrder();

  return (
    <div className=" rounded-lg p-4 flex space-x-3">
      <div className="flex">
        <img
          width={96}
          height={96}
          className="w-24 object-contain"
          src={props.fields.imagemUrl?.stringValue}
          alt=""
        />
      </div>
      <div className="flex flex-col space-y-3 flex-grow">
        <h5 className="text-base poppins text-gray-700">
          {props.fields.nome?.stringValue}
        </h5>
        <h1 className="font-semibold text-lg text-orange-500">
          R$ {parseFloat(props.fields.preco?.stringValue).toFixed(2)}
        </h1>
        <p className="text-sm poppins text-gray-400">
          {props.fields.categoria?.stringValue}
        </p>
      </div>

      <div className="flex items-center px-4 py-2 space-x-3">
        <span className="text-lg text-gray-700 poppins select-none">
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
          className="w-6 h-6 text-gray-600 transform transition hover:scale-105 duration-500 cursor-pointer"
          onClick={() => removeOrder(props.fields.nome?.stringValue)}
        />
      </div>
    </div>
  );
};

export default OrderCard;
