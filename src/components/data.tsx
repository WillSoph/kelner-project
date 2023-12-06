import {
    FaceSmileIcon,
    ChartBarSquareIcon,
    CursorArrowRaysIcon,
    DevicePhoneMobileIcon,
    AdjustmentsHorizontalIcon,
    SunIcon,
  } from "@heroicons/react/24/solid";
  
  import benefitOneImg from "../../public/images/benefit-one.png";
  import benefitTwoImg from "../../public/images/benefit-two.png";
  
  const benefitOne = {
    title: "Revolucione a Gestão do Seu Cardápio com o Kelner",
    desc: "Simplifique as atualizações do cardápio com facilidade através do painel administrativo intuitivo do Kelner. Gere instantaneamente um QRCode personalizado para um cardápio virtual, abraçando a conveniência moderna.",
    image: benefitOneImg,
    bullets: [
      {
        title: "Compreenda seus clientes",
        desc: "Potencialize seu negócio compreendendo as preferências dos clientes por meio da categorização fácil de produtos e edições sem complicações.",
        icon: <FaceSmileIcon />,
      },
      {
        title: "Melhore a aquisição",
        desc: "Aumente a eficiência e o envolvimento do cliente com a geração rápida de QRCode do Kelner, garantindo uma experiência de cardápio virtual suave e atraente para seus clientes.",
        icon: <ChartBarSquareIcon />,
      },
      {
        title: "Estimule a retenção de clientes",
        desc: "Fomente a lealdade com atualizações pontuais e um cardápio online dinâmico, proporcionando uma experiência de refeição aprimorada e memorável para seus clientes. Kelner, onde a inovação encontra a satisfação.",
        icon: <CursorArrowRaysIcon />,
      },
    ],
  };
  
  const benefitTwo = {
    title: "Conheça mais benefícios",
    desc: "Todo o sistema Kelner foi pensado desde o início para oferecer a melhor experiência tanto para seu comércio quanto para seus clientes.",
    image: benefitTwoImg,
    bullets: [
      {
        title: "Sistema completamente responsivo",
        desc: "Kelner foi desenvolvido pensando na total experiencia mobile.",
        icon: <DevicePhoneMobileIcon />,
      },
      {
        title: "Tecnologia atual à seu dispor",
        desc: "Sistema desenvolvido com as mais recentes tecnologiase ferramentas.",
        icon: <AdjustmentsHorizontalIcon />,
      },
      {
        title: "Dark e Light Mode",
        desc: "O painel do Kelner oferece opções de light e dark mode.",
        icon: <SunIcon />,
      },
    ],
  };
  
  
  export {benefitOne, benefitTwo};