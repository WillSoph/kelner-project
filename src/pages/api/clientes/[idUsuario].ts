import { NextApiRequest, NextApiResponse } from 'next';
import ColecaoCliente from '../../../firebase/db/ColecaoCliente';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { idUsuario } = req.query;

  if (!idUsuario) {
    return res.status(400).json({ error: 'ID do usuário não fornecido' });
  }

  try {
    const colecaoCliente = new ColecaoCliente();
    const clientes = await colecaoCliente.obterTodosDoUsuario(idUsuario as string);

    res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao obter clientes:', error);
    res.status(500).json({ error: 'Erro ao obter clientes' });
  }
}