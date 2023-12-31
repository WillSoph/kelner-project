import React, { useState } from 'react'
import swal from 'sweetalert'
import { useDelivery } from '../../contexts/DeliveryProvider'
import useAuth from '../../hooks/useAuth'
import TextField from '../Form/TextField'

const DeliveryForm = () => {
  const { user } = useAuth()

  const [change, setChange] = useState({
    country: '',
    roadNo: '',
    flatno: '',
    name: `${user.displayName}`,
  })
  const { setInput, setDisabled } = useDelivery()

  const handleChange = (e) => {
    const { value, name } = e.target
    setChange((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setInput({
      country: change.country,
      roadNo: change.roadNo,
      flatno: change.flatno,
      name: change.name,
    })
    swal(
      'Information Updated!',
      'Your shipping details updated successfully!',
      'success',
    )
    setDisabled(false)
  }

  return (
    <div className="mt-20 flex flex-col">
      <h1 className="poppins border-b border-gray-500 pb-4 text-2xl text-gray-700">
        Edit Delivery Details
      </h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-3">
          <TextField
            type="text"
            placeholder="Country and District"
            name="country"
            value={change.country}
            onChange={handleChange}
            required
          />
          <TextField
            type="text"
            placeholder="Road Name and Road No"
            name="roadNo"
            value={change.roadNo}
            onChange={handleChange}
            required
          />
          <TextField
            type="text"
            placeholder="Flat, suite or floor"
            name="flatno"
            value={change.flatno}
            onChange={handleChange}
            required
          />
          <TextField
            type="text"
            placeholder="Delivery to"
            name="name"
            value={change.name}
            onChange={handleChange}
            required
          />
          <button className="bg-primary poppins w-full rounded-lg px-6 py-3 text-white ring-red-300 transition duration-500 focus:ring-4">
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default DeliveryForm
