export default class Empresa {
    #id: string;
    #nome: string;
    #imagemUrl: string | File;
  
    constructor(nome: string, imagemUrl: string | File, id: string = null) {
      this.#nome = nome;
      this.#imagemUrl = imagemUrl;    
      this.#id = id;
    }
  
    static vazio() {
      return new Empresa('', '');
    }

    get id() {
        return this.#id;
      }
  
    get nome() {
      return this.#nome;
    }
  
    get imagemUrl() {
      return this.#imagemUrl;
    }
  }