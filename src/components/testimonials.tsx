import Image from 'next/image'
import React from 'react'
import Container from './container'

import userOneImg from '../../public/images/user1.jpg'
import userTwoImg from '../../public/images/user2.jpg'
import userThreeImg from '../../public/images/user3.jpg'

const Testimonials = () => {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-auto">
          <div className="dark:bg-trueGray-800 flex h-full w-full flex-col justify-between rounded-2xl bg-gray-100 px-14 py-14">
            <p className="text-2xl leading-normal ">
              Menu Simples revolucionou nosso cardápio! <Mark>Fácil</Mark> e
              eficiente.
            </p>

            <Avatar
              image={userOneImg}
              name="Ana Oliveira"
              title="Chef Executiva no Restaurante Sabor & Arte"
            />
          </div>
        </div>
        <div className="">
          <div className="dark:bg-trueGray-800 flex h-full w-full flex-col justify-between rounded-2xl bg-gray-100 px-14 py-14">
            <p className="text-2xl leading-normal ">
              A geração de QRCode instantânea é <Mark>incrível</Mark>. Amamos o
              Menu Simples!
            </p>

            <Avatar
              image={userTwoImg}
              name="Lucas Santos"
              title="Proprietário no Bistrô da Praça"
            />
          </div>
        </div>
        <div className="">
          <div className="dark:bg-trueGray-800 flex h-full w-full flex-col justify-between rounded-2xl bg-gray-100 px-14 py-14">
            <p className="text-2xl leading-normal ">
              Com o Menu Simples, atualizar o cardápio é um piscar de olhos.{' '}
              <Mark>Top</Mark>!
            </p>

            <Avatar
              image={userThreeImg}
              name="Rodrigo Silva"
              title="Gerente Geral no Cantinho Gourmet"
            />
          </div>
        </div>
      </div>
    </Container>
  )
}

function Avatar(props) {
  return (
    <div className="mt-8 flex items-center space-x-3">
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
        <Image
          src={props.image}
          width="40"
          height="40"
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-medium">{props.name}</div>
        <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  )
}

function Mark(props) {
  return (
    <>
      {' '}
      <mark className="rounded-md bg-indigo-100 text-indigo-800 ring-4 ring-indigo-100 dark:bg-indigo-900 dark:text-indigo-200 dark:ring-indigo-900">
        {props.children}
      </mark>{' '}
    </>
  )
}

export default Testimonials
