import Head from 'next/head'
import Navbar from '../components/navbar'
import SectionTitle from '../components/sectionTitle'

import { benefitOne, benefitTwo } from '../components/data'
import Video from '../components/video'
import Benefits from '../components/benefits'
import Footer from '../components/footer'
import PopupWidget from '../components/popupWidget'

export default function Preco() {
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
        id="preco"
        pretitle="Quanto custa para usar o Menu Simples"
        title="Quanto custa para usar o Menu Simples?"
      >        
        O plano atual da Menu Simples tem uma mensalidade de apenas 25 reais. 
        Com ele, os usuários têm acesso ao painel administrativo, 
        onde podem cadastrar, alterar e excluir produtos no 
        cardápio virtual. Além disso, oferece a funcionalidade 
        de gerar QR Codes para que os clientes possam acessar 
        facilmente o cardápio virtual. Uma solução completa para 
        a gestão eficiente do estabelecimento.
      </SectionTitle>
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
