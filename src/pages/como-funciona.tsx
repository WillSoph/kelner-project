import Head from 'next/head'
import Navbar from '../components/navbar'
import SectionTitle from '../components/sectionTitle'

import { benefitOne, benefitTwo } from '../components/data'
import Video from '../components/video'
import Benefits from '../components/benefits'
import Footer from '../components/footer'
import PopupWidget from '../components/popupWidget'

export default function ComoFunciona() {
  return (
    <>
      <Head>
        <title>Menu Simples - Sistema para cardápio virtual</title>
        <meta
          name="description"
          content="Desenvolvido para atender às necessidades únicas do setor gastronômico"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <SectionTitle
        pretitle="Assista o vídeo"
        title="Veja como é fácil assinar e usar o Menu Simples"
      >
        Veja como é simples assinar e utilizar o Menu Simples para revolucionar a
        gestão do seu cardápio. Assista ao vídeo e transforme seu negócio hoje
        mesmo!
      </SectionTitle>
      <Video />
      <Footer />
      <PopupWidget />
    </>
  )
}
