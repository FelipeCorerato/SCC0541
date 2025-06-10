import api from './api';

// Interface baseada na função get_constructors do banco de dados
// que retorna: constructor_id, constructor_name, total_pontos
export interface Constructor {
  constructor_id: number;
  constructor_name: string;
  total_pontos: number;
}

export interface EscuderiaStatus {
  status: string;
  total: number;
}

export interface EscuderiaPilotoVitorias {
  piloto: string;
  vitorias: number;
}

// Interface para o resultado da função fn_escuderia_anos_atividade
export interface EscuderiaAnosAtividade {
  primeiro_ano: number;
  ultimo_ano: number;
}

/**
 * Chama a função get_constructors do banco de dados
 * que retorna as escuderias com a soma total dos pontos obtidos nas corridas do ano atual
 * 
 * A função SQL retorna uma TABLE com:
 * - constructor_id: c.constructorId
 * - constructor_name: c.name
 * - total_pontos: SUM(res.points)::DOUBLE PRECISION
 */
export const getConstructors = async (): Promise<Constructor[]> => {
  try {
    // PostgREST permite chamar funções usando rpc/
    const { data } = await api.post<Constructor[]>('/rpc/get_constructors');
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar escuderias:', error);
    throw new Error('Erro ao carregar dados das escuderias');
  }
};

// Manter a interface original para compatibilidade com outras partes do sistema
export interface ConstructorOriginal {
  constructorid: number;
  constructorref: string;
  name: string;
  nationality: string;
  url: string;
}

export const createConstructor = (constructor: Omit<ConstructorOriginal, 'constructorid'>) =>
  api.post<ConstructorOriginal>('/constructors', constructor)
      .then(res => res.data);

export const getEscuderiaResultadosPorStatus = async (constructorId: number): Promise<EscuderiaStatus[]> => {
  try {
    const { data } = await api.post<EscuderiaStatus[]>('/rpc/fn_escuderia_resultados_por_status', {
      constr_id: constructorId
    });
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar status da escuderia:', error);
    throw new Error('Erro ao carregar dados de status da escuderia');
  }
};

export const getEscuderiaPilotosVitorias = async (constructorId: number): Promise<EscuderiaPilotoVitorias[]> => {
  try {
    const { data } = await api.post<EscuderiaPilotoVitorias[]>('/rpc/fn_escuderia_pilotos_vitorias', {
      constr_id: constructorId
    });
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar vitórias dos pilotos da escuderia:', error);
    throw new Error('Erro ao carregar dados de vitórias dos pilotos');
  }
};

/**
 * Chama a função fn_escuderia_total_vitorias do banco de dados
 * que retorna o total de vitórias da escuderia
 */
export const getEscuderiaTotalVitorias = async (constructorId: number): Promise<number> => {
  try {
    const { data } = await api.post<number>('/rpc/fn_escuderia_total_vitorias', {
      constr_id: constructorId
    });
    return data || 0;
  } catch (error) {
    console.error('Erro ao buscar total de vitórias da escuderia:', error);
    throw new Error('Erro ao carregar total de vitórias da escuderia');
  }
};

/**
 * Chama a função fn_escuderia_total_pilotos do banco de dados
 * que retorna o total de pilotos diferentes que correram pela escuderia
 */
export const getEscuderiaTotalPilotos = async (constructorId: number): Promise<number> => {
  try {
    const { data } = await api.post<number>('/rpc/fn_escuderia_total_pilotos', {
      constr_id: constructorId
    });
    return data || 0;
  } catch (error) {
    console.error('Erro ao buscar total de pilotos da escuderia:', error);
    throw new Error('Erro ao carregar total de pilotos da escuderia');
  }
};

/**
 * Chama a função fn_escuderia_anos_atividade do banco de dados
 * que retorna o primeiro e último ano com dados da escuderia
 */
export const getEscuderiaAnosAtividade = async (constructorId: number): Promise<EscuderiaAnosAtividade | null> => {
  try {
    const { data } = await api.post<EscuderiaAnosAtividade[]>('/rpc/fn_escuderia_anos_atividade', {
      constr_id: constructorId
    });
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar anos de atividade da escuderia:', error);
    throw new Error('Erro ao carregar anos de atividade da escuderia');
  }
};
