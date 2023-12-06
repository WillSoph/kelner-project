export default class Cliente {
    #id: string;
    #nome: string;
    #descricao: string;
    #categoria: string;
    #imagemUrl: string | File;
    #preco: number;
  
    constructor(nome: string, descricao: string, categoria: string, imagemUrl: string | File, preco: number, id: string = null) {
      this.#nome = nome;
      this.#descricao = descricao;
      this.#categoria = categoria;
      this.#imagemUrl = imagemUrl;
      this.#preco = preco;
      this.#id = id;      
    }
  
    static vazio() {
      return new Cliente('', '', '', '', 0);
    }
  
    get id() {
      return this.#id;
    }
  
    get nome() {
      return this.#nome;
    }

    get descricao() {
      return this.#descricao;
    }
  
    get categoria() {
      return this.#categoria;
    }
  
    get imagemUrl() {
      return this.#imagemUrl;
    }
  
    get preco() {
      return this.#preco;
    }
  }