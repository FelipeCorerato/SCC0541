import api from './api';

export interface Constructor {
  constructorid: number;
  constructorref: string;
  name: string;
  nationality: string;
  url: string;
}

export interface EscuderiaStatus {
  status: string;
  total: number;
}

export interface EscuderiaPilotoVitorias {
  piloto: string;
  vitorias: number;
}

export const getConstructors = (): Promise<Constructor[]> =>
  api
    .get<Constructor[]>(`/constructors`)
    .then(res => res.data);

export const createConstructor = (constructor: Omit<Constructor, 'constructorid'>) =>
  api.post<Constructor>('/constructors', constructor)
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
