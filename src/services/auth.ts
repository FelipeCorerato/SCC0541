import api from './api';

export interface User {
  userid: number;
  login: string;
  tipo: string;
  idoriginal: number;
}

/**
 * Tenta autenticar contra a tabela users.
 * @param user Login (campo login)
 * @param pass Senha (campo password)
 */
export async function login(user: string, pass: string): Promise<User> {
  // Monta o filtro: login=eq.<user>&password=eq.<pass>
  const qs = new URLSearchParams({
    login:  `eq.${encodeURIComponent(user)}`,
    password:`eq.${encodeURIComponent(pass)}`
  }).toString();

  // Chama o PostgREST
  const { data } = await api.get<User[]>(`/users?${qs}`);

  if (!data.length) {
    throw new Error('Login ou senha inválidos');
  }
  return data[0];
}