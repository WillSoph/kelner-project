import firebase from "firebase";

export default class Vendas {
  #id?: string;
  #dataHoraEnvio: firebase.firestore.Timestamp;
  #listaDeCompras: {
    nome?: string;
    quantidade: number;
    preco: string;
  }[];
  #total: number;

  constructor(listaDeCompras: { nome: string; quantidade: number; preco: string }[], dataHoraEnvio: Date, id?: string) {
    this.#listaDeCompras = listaDeCompras;
    this.#dataHoraEnvio = firebase.firestore.Timestamp.fromDate(dataHoraEnvio);
    this.#id = id;

    // Calcular o total no construtor
    this.#total = this.calcularTotal();
  }

  static vazio() {
    return new Vendas([], new Date(), '');
  }

  // Método para calcular o total
  calcularTotal(): number {
    return this.#listaDeCompras.reduce((total, produto) => {
      return total + parseFloat(produto.preco);
    }, 0);
  }

  get id() {
    return this.#id;
  }

  get dataHoraEnvio() {
    return this.#dataHoraEnvio.toDate();
  }

  get listaDeCompras() {
    return this.#listaDeCompras;
  }

  get total() {
    return this.#total;
  }
}