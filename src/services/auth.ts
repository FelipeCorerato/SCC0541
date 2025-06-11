import api from './api';

export interface User {
  userid: number;
  login: string;
  tipo: string;
  idoriginal: number;
}

/**
 * Registra um log de ação do usuário usando a função fn_create_users_log
 * @param userId ID do usuário
 * @param action Ação realizada ('login' ou 'logout')
 */
export async function createUserLog(userId: number, action: 'login' | 'logout'): Promise<void> {
  try {
    await api.post('/rpc/fn_create_users_log', {
      u_id: userId,
      u_acao: action
    });
  } catch (error) {
    console.error('Erro ao registrar log do usuário:', error);
    // Não lança erro para não interromper o fluxo de login/logout
  }
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