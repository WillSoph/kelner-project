import React from "react";
import Container from "./container";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";

const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-indigo-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
}

const faqdata = [
  {
    question: "Como faço para assinar o Kelner?",
    answer: "É super simples! No topo dessa página clique em 'Login/Cadastrar'. Em seguida, se você ainda não possui uma conta, clique na frase 'Novo por aqui? Abra sua conta'.Após efetuar o Login, ficará disponível o botão 'Assine Agora'. Basta clicar, efetuar o pagamento da assinatura, e agora você terá disponível no topo do site a opção 'Acessar o Painel'. ",
  },
  {
    question: "Existe limite para quantidade de produtos cadastrados?",
    answer: "Não! Você poderá cadastrar quantos produtos quiser sem a necessidade de estender seu plano.",
  },
  {
    question: "Quanto custa a assinatura?",
    answer:
      "Por apenas 20 reais mensais você terá disponível toda a plataforma Kelner e suas funcionalidades.",
  },
  {
    question: "Meus dados estão protegidos? ",
    answer:
      "Com certeza! Nós não armazenamos informações sensíveis em nosso banco de dados.",
  },
];

export default Faq;