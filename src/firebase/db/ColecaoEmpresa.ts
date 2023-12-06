import firebase from "../config";
import Empresa from "../../core/Empresa";
import EmpresaRepositorio from "../../core/EmpresaRepositorio";

export default class ColecaoEmpresa implements EmpresaRepositorio {
  #conversor = {
    toFirestore(empresa: Empresa) {
      return {
        nome: empresa.nome,
        imagemUrl: empresa.imagemUrl,
      };
    },
    fromFirestore(
      snapshot: firebase.firestore.QueryDocumentSnapshot,
      options: firebase.firestore.SnapshotOptions
    ): Empresa {
      const dados = snapshot.data(options);
      return new Empresa(dados.nome, dados.imagemUrl, snapshot.id);
    },
  };

//   async salvar(empresa: Empresa): Promise<Empresa> {
//     const idUsuario = firebase.auth().currentUser?.uid;

//     if (empresa?.id && idUsuario) {
//       await this.colecao(idUsuario).doc(empresa.id).set(empresa);
//       return empresa;
//     } else {
//       const docRef = await this.colecao(idUsuario).add(empresa);
//       const doc = await docRef.get();
//       return doc.data();
//     }
//   }

async salvar(empresa: Empresa): Promise<Empresa> {
    const idUsuario = firebase.auth().currentUser?.uid;
  
    if (idUsuario) {
      // Obtém todas as empresas associadas ao usuário
      const querySnapshot = await this.colecao(idUsuario).get();
  
      // Verifica se há alguma empresa associada ao usuário
      if (querySnapshot.size > 0) {
        // Se houver, atualiza a primeira empresa encontrada
        const primeiraEmpresa = querySnapshot.docs[0];
        await this.colecao(idUsuario).doc(primeiraEmpresa.id).set(empresa);
        return empresa;
      } else {
        // Se não houver empresas associadas, adiciona uma nova
        const docRef = await this.colecao(idUsuario).add(empresa);
        const doc = await docRef.get();
        return doc.data();
      }
    } else {
      throw new Error("Usuário não autenticado.");
    }
  }

  async excluir(empresa: Empresa): Promise<void> {
    const idUsuario = firebase.auth().currentUser?.uid;

    if (idUsuario) {
      return this.colecao(idUsuario).doc(empresa.id).delete();
    } else {
      throw new Error("Usuário não autenticado.");
    }
  }

  async obterTodos(): Promise<Empresa[]> {
    try {
      const idUsuario = await this.obterIdUsuario();
  
      if (idUsuario) {
        const query = await this.colecao(idUsuario).get();
        return query.docs.map((doc) => doc.data()) ?? [];
      }
  
      return [];
    } catch (error) {
      console.error("Erro ao obter empresa:", error);
      return [];
    }
  }

  async obterTodosDoUsuario(idUsuario: string): Promise<Empresa[]> {
    try {
      const query = await this.colecao(idUsuario).get();
      return query.docs.map((doc) => doc.data()) ?? [];
    } catch (error) {
      console.error('Erro ao obter empresas do usuário:', error);
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
    return firebase.firestore().collection(`usuarios/${idUsuario}/empresa`).withConverter(this.#conversor);
  }
}