import Vendas from './Vendas'

export default interface VendasRepositorio {
  salvar(vendas: Vendas): Promise<Vendas>
  excluir(vendas: Vendas): Promise<void>
  obterTodos(): Promise<Vendas[]>
}
