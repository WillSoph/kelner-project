import Empresa from "./Empresa";

export default interface EmpresaRepositorio {
    salvar(empresa: Empresa): Promise<Empresa>
    excluir(empresa: Empresa): Promise<void>
    obterTodos(): Promise<Empresa[]>
}