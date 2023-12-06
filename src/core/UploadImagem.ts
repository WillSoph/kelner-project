import firebase from '../firebase/config';

export const uploadImagem = async (imagem: File): Promise<string> => {
  const storageRef = firebase.storage().ref();
  const nomeArquivo = imagem.name;
  const caminhoArquivo = `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET${nomeArquivo}`;
  const arquivoRef = storageRef.child(caminhoArquivo);

  try {
    // Faz o upload da imagem para o armazenamento do Firebase
    await arquivoRef.put(imagem);

    // Obtém a URL da imagem após o upload
    const urlImagem = await arquivoRef.getDownloadURL();

    return urlImagem;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error; // Trate o erro de acordo com suas necessidades
  }
};