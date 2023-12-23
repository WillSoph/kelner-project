import Head from 'next/head'
import Navbar from '../components/navbar'
import SectionTitle from '../components/sectionTitle'
import Footer from '../components/footer'
import PopupWidget from '../components/popupWidget'

export default function Termos() {
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
      <SectionTitle
        pretitle=""
        title="Privacidade"
      >
        
      </SectionTitle>
      <div className="pl-5 pr-5 md:pl-20 md:pr-20">
      Elaboramos nossa Política de Privacidade visando sempre sermos transparentes quanto à correta utilização das informações fornecidas por cada usuário. A privacidade dos usuários é muito importante para nós.

      A título de transparência, a Kelner poderá modificar as regras citadas abaixo visando melhorias em seus sistemas. Portanto, recomendamos que a leitura de nossa política de privacidade seja realizada de forma periódica.
      <br />
      <h2>Tipo de informação armazenada</h2>
      Quando você cria uma conta no site Kelner, capturamos informações como nome do responsável, e-mail, telefone, endereço, CNPJ. 

      O sistema também armazena dados cadastrais, preferências e histórico de compra de clientes que se cadastraram no site. Esses dados apenas podem ser consultados pelo próprio cliente, mediante identificação por senha. Dessa forma, os dados pessoais de clientes estarão protegidos contra o uso indevido por terceiros e desde já fica consentido que os mesmos poderão ser tratados exclusivamente pelo Kelner, nos termos da Lei Geral de Proteção de Dados – LGPD.
      <br />
      <h2>Forma de armazenamento</h2>
      Os dados são armazenados “na nuvem” e acessados remotamente, sendo necessário apenas um computador com acesso a Internet.
      <br />
      <h2>Segurança</h2>
      O Kelner utiliza a Google Cloud, um dos maiores datacenters do mundo. Com ISO 27001, provê várias camadas de segurança física e operacional. Possui redundância de serviços e estrutura incluindo DNS, servidores e storage. CDN distribuído por várias regiões do globo para entrega de conteúdo com baixa latência.
      <br />
      <h2>Utilização dos dados armazenados</h2>
      Utilizamos seus dados pessoais para enviar avisos importantes, como comunicados da ferramenta, changelog, condições e políticas, informações sobre o pacote do plano adquirido, entre outras. Como estas informações são importantes para a sua interação com o Kelner. Por este termo o cliente manifesta seu total e expresso consentimento para que o Kelner utilize seus dados pessoais exclusivamente para a finalidade abaixo, sendo vedado o compartilhamento com terceiros.

      Poderemos utilizar seus dados pessoais para nos ajudar a desenvolver, oferecer e melhorar os nossos produtos, serviços, conteúdo, parcerias e publicidade, bem como para auditoria, análise de dados e pesquisas para aprimorar os produtos, serviços e comunicações com os nossos clientes. Nesses casos, você poderá optar por receber ou não essa comunicação.

      Utilizaremos seus dados, ainda, para faturamento e cobrança dos Serviços contratados.
      <br />
      <h2>Site de terceiros e responsabilidade dos usuários</h2>
      Nosso site poderá conter links para outros sites não pertencentes à Kelner. Nesses casos, a Kelner não é responsável pelas ações desses sites, para os quais não será aplicável a presente Política de Privacidade.

      A Kelner é titular de direitos sobre todos os bancos de dados e dispositivos de armazenamento de dados, bem como sobre os softwares de que utiliza. No entanto, a Kelner não será titular das informações do usuário armazenadas no site e/ou recebidas em decorrência das vendas realizadas através do site, as quais sempre pertencerão aos usuários.
      <br />
      <h2>O que você deve fazer para proteger seus dados?</h2>
      Você também é responsável pela segurança e sigilo das suas senhas e/ou informações confidenciais. Dessa forma, recomendamos:

      Ao acessar a Internet busque sempre conhecer a política de privacidade do site que você está acessando.

      Use senhas complexas que dificultem sua detecção por outras pessoas, senhas simples são facilmente quebradas.
      Nunca forneça sua senha a ninguém e procure criar senhas novas periodicamente.
      <br />
      <span>Se você tiver qualquer dúvida com relação à nossa Política de Privacidade, entre em contato conosco.
      Ao usar o serviços do site o usuário concorda com os termos.
      </span>
      </div>
      <Footer />
      <PopupWidget />
    </>
  )
}
