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
