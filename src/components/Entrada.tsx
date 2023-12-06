import { NumericFormat } from 'react-number-format';

interface EntradaProps {
    tipo?: 'text' | 'number' | 'select'
    texto: string
    valor: any
    somenteLeitura?: boolean
    className?: string
    valorMudou?: (valor: any) => void
}



export default function Entrada(props: EntradaProps) {
    const renderizarInput = () => {
        if (props.tipo === 'number') {
          return (
            <div className='mt-2 relative'>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <NumericFormat
              value={props.valor}
              onValueChange={(values) => {
                const { value } = values;
                props.valorMudou?.(value);
              }}
              readOnly={props.somenteLeitura}
              className={`
                block w-full rounded-md border-0 py-2 px-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              `}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              fixedDecimalScale 
            //   isNumericString
            />
            </div>
          );
        }
        return (
            <input
              type={props.tipo ?? 'text'} 
              value={props.valor}
              readOnly={props.somenteLeitura}
              onChange={e => props.valorMudou?.(e.target.value)}
              className={`
                block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              `}
            />
          );
    }    
    return (
        <div className={`flex flex-col ${props.className}`}>
            {/* <label className="mb-2">
                {props.texto}
            </label>
            <input 
                type={props.tipo ?? 'text'} 
                value={props.valor}
                readOnly={props.somenteLeitura}
                onChange={e => props.valorMudou?.(e.target.value)}
                className={`
                    border border-purple-500 rounded-lg 
                    focus:outline-none bg-gray-100 px-4 py-2 
                    ${props.somenteLeitura ? '' : 'focus:bg-white'}
                `}
            /> */}
            

            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                {props.texto}
              </label>
                {renderizarInput()}
            </div>
        </div>
    )
}
