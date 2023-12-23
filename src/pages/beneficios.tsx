import Head from 'next/head'
import Hero from '../components/hero'
import Navbar from '../components/navbar'
import SectionTitle from '../components/sectionTitle'

import { benefitOne, benefitTwo } from '../components/data'
import Video from '../components/video'
import Benefits from '../components/benefits'
import Footer from '../components/footer'
import Testimonials from '../components/testimonials'
import Faq from '../components/faq'
import PopupWidget from '../components/popupWidget'

export default function Home() {
  return (
    <>
      <Head>
        <title>Kelner - Sistema para cardápio virtual</title>
        <meta
          name="description"
          content="Desenvolvido para atender às necessidades únicas do setor gastronômico"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      {/* <Hero /> */}
      <SectionTitle
        id="beneficios"
        pretitle="Benefícios do Kelner"
        title=" Por que você deveria usar o Kelner?"
      >
        O Kelner simplifica a gestão do seu cardápio, permitindo fácil cadastro
        e atualização de produtos. Com a geração instantânea de QRCode, seus
        clientes acessam um cardápio virtual personalizado, proporcionando
        praticidade e modernidade. Imprima ou compartilhe seu menu em segundos.
        Kelner, a escolha inteligente para restaurantes inovadores.
      </SectionTitle>
      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      <SectionTitle
        pretitle="Assista o vídeo"
        title="Veja como é fácil assinar e usar o Kelner"
      >
        Veja como é simples assinar e utilizar o Kelner para revolucionar a
        gestão do seu cardápio. Assista ao vídeo e transforme seu negócio hoje
        mesmo!
      </SectionTitle>
      <Video />
      {/* <SectionTitle pretitle="Depoimentos" title="O que nossos clientes dizem">
        Confira o depoimento de quem já usa o Kelner para impulsionar a
        experiência de seus clientes.
      </SectionTitle>
      <Testimonials />
      <SectionTitle pretitle="FAQ" title="Perguntas Frequentes">
        Destacamos aqui algumas das perguntas mais frequentes em relação ao
        Kelner e nossa resposta para cada uma delas. Veja se a sua dúvida está
        entre elas.
      </SectionTitle>
      <Faq /> */}
      {/* <Cta /> */}
      <Footer />
      <PopupWidget />
    </>
  )
}
