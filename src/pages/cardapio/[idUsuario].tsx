import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import FoodItem from './components/FoodItem'
import Navbar from './components/Navbar'
import { useOrder } from '../../contexts/OrderProvider'

function Cardapio() {
  const router = useRouter()
  const { idUsuario } = router.query
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [menuTab, setMenuTab] = useState('Menu completo')
  const { setClientData } = useOrder()

  type Cliente = {
    createTime: string;
    fields?: {
      nome?: {
        stringValue?: string;
      };
      imagemUrl?: {
        stringValue?: string;
      };
      descricao?: {
        stringValue?: string;
      };
      preco?: {
        stringValue?: string;
      };
      categoria?: {
        stringValue?: string;
      };
    };
  };

  useEffect(() => {
    if (idUsuario) {
      obterClientes(idUsuario)
    }
  }, [idUsuario])

  const url = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  const obterClientes = async (userId) => {
    try {
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/${url}/databases/(default)/documents/usuarios/${idUsuario}/clientes`
      )

      const clientesData = response.data.documents
      setClientes(clientesData)
      setClientData(clientesData)

      console.log('enviando', clientesData)
    } catch (error) {
      console.error('Erro ao obter clientes:', error)
    }
  }

  const handleMenuTabs = (type) => {
    setMenuTab(type)
  }

  // const filteredClientes = clientes.filter((cliente) => {
  //   const categoria = cliente.fields.categoria?.stringValue

    
  //   if (menuTab === 'Menu completo') {
  //     return clientes
  //   } else {
  //     return categoria === menuTab
  //   }
  // })
  

  const filteredAndSortedClientes = clientes
  .filter((cliente) => {
    const categoria = cliente.fields?.categoria?.stringValue;
    return menuTab === 'Menu completo' || categoria === menuTab;
  })
  .sort((a, b) => {
    const categoriaA = a.fields?.categoria?.stringValue || '';
    const categoriaB = b.fields?.categoria?.stringValue || '';
    return categoriaA.localeCompare(categoriaB);
  });

  return (
    <div>
      <Navbar />
      <section className="mx-auto my-16 max-w-screen-xl px-6">
        <div className="flex items-center justify-start space-x-6 overflow-x-auto">
          <p
            className={
              menuTab === 'Menu completo'
                ? 'active_menu_tab poppins bg-primary'
                : 'menu_tab poppins'
            }
            onClick={() => handleMenuTabs('Menu completo')}
            style={{ whiteSpace: 'nowrap' }}
          >
            Menu completo
          </p>
          <p
            className={
              menuTab === 'Entrada'
                ? 'active_menu_tab poppins bg-primary'
                : 'menu_tab poppins'
            }
            onClick={() => handleMenuTabs('Entrada')}
          >
            Entrada
          </p>
          <p
            className={
              menuTab === 'Prato principal'
                ? 'active_menu_tab poppins bg-primary'
                : 'menu_tab poppins'
            }
            onClick={() => handleMenuTabs('Prato principal')}
            style={{ whiteSpace: 'nowrap' }}
          >
            Prato principal
          </p>
          <p
            className={
              menuTab === 'Sobremesa'
                ? 'active_menu_tab poppins bg-primary'
                : 'menu_tab poppins'
            }
            onClick={() => handleMenuTabs('Sobremesa')}
          >
            Sobremesa
          </p>
          <p
            className={
              menuTab === 'Bebida sem álcool'
                ? 'active_menu_tab poppins bg-primary'
                : 'menu_tab poppins'
            }
            onClick={() => handleMenuTabs('Bebida sem álcool')}
            style={{ whiteSpace: 'nowrap' }}
          >
            Bebida sem álcool
          </p>
          <p
            className={
              menuTab === 'Bebida alcoólica'
                ? 'active_menu_tab poppins bg-primary'
                : 'menu_tab poppins'
            }
            onClick={() => handleMenuTabs('Bebida alcoólica')}
            style={{ whiteSpace: 'nowrap' }}
          >
            Bebida alcoólica
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* {filteredClientes.map((cliente) => (
            <FoodItem 
              key={cliente.createTime} 
              nome={cliente.fields.nome?.stringValue} 
              imagemUrl={cliente.fields.imagemUrl?.stringValue} 
              descricao='Este é um texto de exemplo enquanto não tem a descrição'
              preco={cliente.fields.preco?.stringValue}
              categoria={cliente.fields.categoria?.stringValue}
            />
          ))} */}
          {filteredAndSortedClientes.map((cliente) => (
            <FoodItem
            key={cliente.createTime}
            nome={cliente.fields?.nome?.stringValue || ''}
            imagemUrl={cliente.fields?.imagemUrl?.stringValue || ''}
            descricao={cliente.fields?.descricao?.stringValue || ''}
            preco={cliente.fields?.preco?.stringValue || ''}
            categoria={cliente.fields?.categoria?.stringValue || ''}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Cardapio
