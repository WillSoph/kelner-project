import firebase from '../config'
import Vendas from '../../core/Vendas'
import VendasRepositorio from '../../core/VendasRepositorio'

export default class ColecaoVendas implements VendasRepositorio {
  #conversor = {
    toFirestore(vendas: Vendas) {
      return {
        dataHoraEnvio: vendas.dataHoraEnvio ? firebase.firestore.Timestamp.fromDate(vendas.dataHoraEnvio) : null,
        listaDeCompras: vendas.listaDeCompras,
        total: vendas.total,
      };
    },
    fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot,
      options: firebase.firestore.SnapshotOptions,
    ): Vendas {
      const dados = snapshot.data(options);
      return new Vendas(
        dados.listaDeCompras,
        dados.dataHoraEnvio.toDate(),
        snapshot.id,
      );
    },
  };

  async salvar(vendas: Vendas): Promise<Vendas> {
    const idUsuario = firebase.auth().currentUser?.uid
    if (vendas?.id && idUsuario) {
      await this.colecao(idUsuario).doc(vendas.id).set(vendas)
      return vendas
    } else {
      const docRef = await this.colecao(idUsuario ? idUsuario : '').add(vendas)
      const doc = await docRef.get()
      return doc.data() as Vendas;
    }
  }

  async excluir(vendas: Vendas): Promise<void> {
    const idUsuario = firebase.auth().currentUser?.uid

    if (idUsuario) {
      return this.colecao(idUsuario).doc(vendas.id).delete()
    } else {
      throw new Error('Usuário não autenticado.')
    }
  }

  async obterTodos(): Promise<Vendas[]> {
    try {
      const idUsuario = await this.obterIdUsuario()

      if (idUsuario) {
        const query = await this.colecao(idUsuario).get()
        return query.docs.map((doc) => doc.data()) ?? []
      }

      return []
    } catch (error) {
      console.error('Erro ao obter vendas:', error)
      return []
    }
  }

  async obterTodosDoUsuario(idUsuario: string): Promise<Vendas[]> {
    try {
      const query = await this.colecao(idUsuario).get()
      return query.docs.map((doc) => doc.data()) ?? []
    } catch (error) {
      console.error('Erro ao obter vendas do usuário:', error)
      return []
    }
  }

  private async obterIdUsuario(): Promise<string | null> {
    return new Promise((resolve) => {
      const cancelar = firebase.auth().onIdTokenChanged((usuario) => {
        const novoIdUsuario = usuario?.uid || null
        resolve(novoIdUsuario)
      })

      return () => {
        if (cancelar) {
          cancelar()
        }
      }
    })
  }

  private colecao(idUsuario: string) {
    return firebase
      .firestore()
      .collection(`usuarios/${idUsuario}/vendas`)
      .withConverter(this.#conversor)
  }
}
