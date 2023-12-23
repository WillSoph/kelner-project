'use client'
import React, { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Disclosure, Transition } from '@headlessui/react'

const PopupWidget = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    mode: 'onTouched',
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [Message, setMessage] = useState('')

  const userName = useWatch({ control, name: 'name', defaultValue: 'Someone' })

  const onSubmit = async (data, e) => {
    console.log(data)
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data, null, 2),
    })
      .then(async (response) => {
        const json = await response.json()
        if (json.success) {
          setIsSuccess(true)
          setMessage(json.message)
          e.target.reset()
          reset()
        } else {
          setIsSuccess(false)
          setMessage(json.message)
        }
      })
      .catch((error) => {
        setIsSuccess(false)
        setMessage('Client Error. Please check the console.log for more info')
        console.log(error)
      })
  }

  return (
    <div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="ease fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-lg transition duration-300 hover:bg-green-800 focus:bg-green-800 focus:outline-none">
              <span className="sr-only">Abrir contato via Whatsapp</span>
              <Transition
                show={!open}
                enter="transition duration-200 transform ease"
                enterFrom="opacity-0 -rotate-45 scale-75"
                leave="transition duration-100 transform ease"
                leaveTo="opacity-0 -rotate-45"
                className="absolute h-6 w-6 text-white"
              >
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>{' '} */}
                <svg fill="#fff" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 308 308" stroke="#25D366"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_468_"> <path id="XMLID_469_" d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"></path> <path id="XMLID_470_" d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"></path> </g> </g></svg>
              </Transition>

              {/* <Transition
                show={open}
                enter="transition duration-200 transform ease"
                enterFrom="opacity-0 rotate-45 scale-75"
                leave="transition duration-100 transform ease"
                leaveTo="opacity-0 rotate-45"
                className="absolute h-6 w-6 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>{' '}
              </Transition> */}
            </Disclosure.Button>
            <Transition
              className="fixed  bottom-[100px] left-0 right-0 top-0  z-50 sm:left-auto sm:right-5 sm:top-auto"
              enter="transition duration-200 transform ease"
              enterFrom="opacity-0 translate-y-5"
              leave="transition duration-200 transform ease"
              leaveTo="opacity-0 translate-y-5"
            >
              <Disclosure.Panel className=" left-0 flex  h-full min-h-[250px] w-full flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-2xl dark:border-gray-800 sm:h-[600px] sm:max-h-[calc(100vh-120px)] sm:w-[350px]">
                <div className="flex h-32 flex-col items-center justify-center bg-indigo-600 p-5">
                  <h3 className="text-lg text-white">How can we help?</h3>
                  <p className="text-white opacity-50">
                    We usually respond in a few hours
                  </p>
                </div>
                <div className="h-full flex-grow overflow-auto bg-gray-50 p-6 ">
                  {!isSubmitSuccessful && (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <input
                        type="hidden"
                        value="YOUR_ACCESS_KEY_HERE"
                        {...register('apikey')}
                      />
                      <input
                        type="hidden"
                        value={`${userName} sent a message from Nextly`}
                        {...register('subject')}
                      />
                      <input
                        type="hidden"
                        value="Nextly Template"
                        {...register('from_name')}
                      />
                      <input
                        type="checkbox"
                        className="hidden"
                        style={{ display: 'none' }}
                        {...register('botcheck')}
                      ></input>

                      <div className="mb-4">
                        <label
                          htmlFor="full_name"
                          className="mb-2 block text-sm text-gray-600 dark:text-gray-400"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          placeholder="John Doe"
                          {...register('name', {
                            required: 'Full name is required',
                            maxLength: 80,
                          })}
                          className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-600 placeholder-gray-300 focus:outline-none focus:ring   ${
                            errors.name
                              ? 'border-red-600 ring-red-100 focus:border-red-600'
                              : 'border-gray-300 ring-indigo-100 focus:border-indigo-600'
                          }`}
                        />
                        {errors.name && (
                          <div className="invalid-feedback mt-1 text-sm text-red-400">
                            Erro
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm text-gray-600 dark:text-gray-400"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register('email', {
                            required: 'Enter your email',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Please enter a valid email',
                            },
                          })}
                          placeholder="you@company.com"
                          className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-600 placeholder-gray-300 focus:outline-none focus:ring   ${
                            errors.email
                              ? 'border-red-600 ring-red-100 focus:border-red-600'
                              : 'border-gray-300 ring-indigo-100 focus:border-indigo-600'
                          }`}
                        />

                        {errors.email && (
                          <div className="invalid-feedback mt-1 text-sm text-red-400">
                            Erro
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="message"
                          className="mb-2 block text-sm text-gray-600 dark:text-gray-400"
                        >
                          Your Message
                        </label>

                        <textarea
                          rows={4}
                          id="message"
                          {...register('message', {
                            required: 'Enter your Message',
                          })}
                          placeholder="Your Message"
                          className={`h-28 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-600 placeholder-gray-300 focus:outline-none focus:ring   ${
                            errors.message
                              ? 'border-red-600 ring-red-100 focus:border-red-600'
                              : 'border-gray-300 ring-indigo-100 focus:border-indigo-600'
                          }`}
                          required
                        ></textarea>
                        {errors.message && (
                          <div className="invalid-feedback mt-1 text-sm text-red-400">
                            Erro
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <button
                          type="submit"
                          className="w-full rounded-md bg-indigo-500 px-3 py-4 text-white focus:bg-indigo-600 focus:outline-none"
                        >
                          {isSubmitting ? (
                            <svg
                              className="mx-auto h-5 w-5 animate-spin text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            'Send Message'
                          )}
                        </button>
                      </div>
                      <p
                        className="text-center text-xs text-gray-400"
                        id="result"
                      >
                        <span>
                          Powered by{' '}
                          <a
                            href="https://Web3Forms.com"
                            className="text-gray-600"
                            rel="noreferrer"
                          >
                            Web3Forms
                          </a>
                        </span>
                      </p>
                    </form>
                  )}

                  {isSubmitSuccessful && isSuccess && (
                    <>
                      <div className="flex h-full flex-col items-center justify-center rounded-md text-center text-white">
                        <svg
                          width="60"
                          height="60"
                          className="text-green-300"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M26.6666 50L46.6666 66.6667L73.3333 33.3333M50 96.6667C43.8716 96.6667 37.8033 95.4596 32.1414 93.1144C26.4796 90.7692 21.3351 87.3317 17.0017 82.9983C12.6683 78.6649 9.23082 73.5204 6.8856 67.8586C4.54038 62.1967 3.33331 56.1283 3.33331 50C3.33331 43.8716 4.54038 37.8033 6.8856 32.1414C9.23082 26.4796 12.6683 21.3351 17.0017 17.0017C21.3351 12.6683 26.4796 9.23084 32.1414 6.88562C37.8033 4.5404 43.8716 3.33333 50 3.33333C62.3767 3.33333 74.2466 8.24998 82.9983 17.0017C91.75 25.7534 96.6666 37.6232 96.6666 50C96.6666 62.3768 91.75 74.2466 82.9983 82.9983C74.2466 91.75 62.3767 96.6667 50 96.6667Z"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                        </svg>
                        <h3 className="py-5 text-xl text-green-500">
                          Message sent successfully
                        </h3>
                        <p className="text-gray-700 md:px-3">{Message}</p>
                        <button
                          className="mt-6 text-indigo-600 focus:outline-none"
                          onClick={() => reset()}
                        >
                          Go back
                        </button>
                      </div>
                    </>
                  )}

                  {isSubmitSuccessful && !isSuccess && (
                    <div className="flex h-full flex-col items-center justify-center rounded-md text-center text-white">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 97 97"
                        className="text-red-400"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.9995 69C43.6205 53.379 52.3786 44.621 67.9995 29M26.8077 29L67.9995 69M48.2189 95C42.0906 95 36.0222 93.7929 30.3604 91.4477C24.6985 89.1025 19.554 85.6651 15.2206 81.3316C10.8872 76.9982 7.44975 71.8538 5.10454 66.1919C2.75932 60.53 1.55225 54.4617 1.55225 48.3333C1.55225 42.205 2.75932 36.1366 5.10454 30.4748C7.44975 24.8129 10.8872 19.6684 15.2206 15.335C19.554 11.0016 24.6985 7.56418 30.3604 5.21896C36.0222 2.87374 42.0906 1.66667 48.2189 1.66667C60.5957 1.66667 72.4655 6.58333 81.2172 15.335C89.9689 24.0867 94.8856 35.9566 94.8856 48.3333C94.8856 60.7101 89.9689 72.58 81.2172 81.3316C72.4655 90.0833 60.5957 95 48.2189 95Z"
                          stroke="CurrentColor"
                          strokeWidth="3"
                        />
                      </svg>

                      <h3 className="py-7 text-xl text-red-400">
                        Oops, Something went wrong!
                      </h3>
                      <p className="text-gray-700 md:px-3">{Message}</p>
                      <button
                        className="mt-6 text-indigo-600 focus:outline-none"
                        onClick={() => reset()}
                      >
                        Go back
                      </button>
                    </div>
                  )}
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default PopupWidget
