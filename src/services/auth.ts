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
 * Tenta autenticar usando a função fn_user_login do PostgreSQL.
 * Esta função já valida as credenciais, verifica o hash da senha e registra o log de login automaticamente.
 * @param user Login (campo login)
 * @param pass Senha (campo password)
 */
export async function login(user: string, pass: string): Promise<User> {
  try {
    // Chama a função fn_user_login via PostgREST
    const { data } = await api.post<User[]>('/rpc/fn_user_login', {
      p_login: user,
      p_password: pass
    });

    // Se não retornou dados, significa que as credenciais são inválidas
    if (!data || data.length === 0) {
      throw new Error('Login ou senha inválidos');
    }

    return data[0];
  } catch (error) {
    // Se for erro de rede ou servidor, mantém a mensagem original
    if (error instanceof Error && error.message !== 'Login ou senha inválidos') {
      console.error('Erro na autenticação:', error);
      throw new Error('Erro ao conectar com o servidor');
    }
    
    // Caso contrário, é erro de credenciais inválidas
    throw error;
  }
}