import firebase from "../config";
import Cliente from "../../core/Cliente";
import ClienteRepositorio from "../../core/ClienteRepositorio";

export default class ColecaoCliente implements ClienteRepositorio {
  #conversor = {
    toFirestore(cliente: Cliente) {
      return {
        nome: cliente.nome,
        descricao: cliente.descricao,
        categoria: cliente.categoria,
        imagemUrl: cliente.imagemUrl,
        preco: cliente.preco,
      };
    },
    fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot,
      options: firebase.firestore.SnapshotOptions
    ): Cliente {
      const dados = snapshot.data(options);
      return new Cliente(dados.nome, dados.descricao, dados.categoria, dados.imagemUrl, dados.preco, snapshot.id);
    },
  };

  async salvar(cliente: Cliente): Promise<Cliente> {
    const idUsuario = firebase.auth().currentUser?.uid;

    if (cliente?.id && idUsuario) {
      await this.colecao(idUsuario).doc(cliente.id).set(cliente);
      return cliente;
    } else {
      const docRef = await this.colecao(idUsuario).add(cliente);
      const doc = await docRef.get();
      return doc.data();
    }
  }

  async excluir(cliente: Cliente): Promise<void> {
    const idUsuario = firebase.auth().currentUser?.uid;

    if (idUsuario) {
      return this.colecao(idUsuario).doc(cliente.id).delete();
    } else {
      throw new Error("Usuário não autenticado.");
    }
  }

  async obterTodos(): Promise<Cliente[]> {
    try {
      const idUsuario = await this.obterIdUsuario();
  
      if (idUsuario) {
        const query = await this.colecao(idUsuario).get();
        return query.docs.map((doc) => doc.data()) ?? [];
      }
  
      return [];
    } catch (error) {
      console.error("Erro ao obter clientes:", error);
      return [];
    }
  }

  async obterTodosDoUsuario(idUsuario: string): Promise<Cliente[]> {
    try {
      const query = await this.colecao(idUsuario).get();
      return query.docs.map((doc) => doc.data()) ?? [];
    } catch (error) {
      console.error('Erro ao obter clientes do usuário:', error);
      return [];
    }
  }
  
  private async obterIdUsuario(): Promise<string | null> {
    return new Promise((resolve) => {
      const cancelar = firebase.auth().onIdTokenChanged((usuario) => {
        const novoIdUsuario = usuario?.uid || null;
        resolve(novoIdUsuario);
      });
  
      return () => {
        if (cancelar) {
          cancelar();
        }
      };
    });
  }

  private colecao(idUsuario: string) {
    return firebase.firestore().collection(`usuarios/${idUsuario}/clientes`).withConverter(this.#conversor);
  }
}