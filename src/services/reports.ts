import api from './api';

// Interface para o resultado da view vw_admin_resultados_por_status
export interface AdminResultadosPorStatus {
  status: string;
  total: number;
}

// Interface para o resultado da view vw_admin_total_corridas
export interface AdminTotalCorridas {
  total_corridas: number;
}

// Interface para o resultado da view vw_admin_corridas_por_circuito
export interface AdminCorridasPorCircuito {
  circuitid: number;
  circuito: string;
  qtd_corridas: number;
  min_voltas: number;
  max_voltas: number;
  media_voltas: number;
}

// Interface para o resultado da view vw_admin_corridas_detalhadas
export interface AdminCorridasDetalhadas {
  circuitid: number;
  raceid: number;
  corrida: string;
  laps: number;
  date: string;
  time: string | null;
}

/**
 * Busca os resultados por status da view vw_admin_resultados_por_status
 * Esta view agrupa os resultados por status e conta quantas vezes cada status ocorreu
 */
export const getAdminResultadosPorStatus = async (): Promise<AdminResultadosPorStatus[]> => {
  try {
    const { data } = await api.get<AdminResultadosPorStatus[]>('/vw_admin_resultados_por_status');
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar resultados por status:', error);
    throw new Error('Erro ao carregar dados de resultados por status');
  }
};

/**
 * Busca o total de corridas cadastradas da view vw_admin_total_corridas
 */
export const getAdminTotalCorridas = async (): Promise<AdminTotalCorridas> => {
  try {
    const { data } = await api.get<AdminTotalCorridas[]>('/vw_admin_total_corridas');
    
    if (data && data.length > 0) {
      return data[0];
    }
    
    return { total_corridas: 0 };
  } catch (error) {
    console.error('Erro ao buscar total de corridas:', error);
    throw new Error('Erro ao carregar total de corridas');
  }
};

/**
 * Busca corridas por circuito da view vw_admin_corridas_por_circuito
 */
export const getAdminCorridasPorCircuito = async (): Promise<AdminCorridasPorCircuito[]> => {
  try {
    const { data } = await api.get<AdminCorridasPorCircuito[]>('/vw_admin_corridas_por_circuito');
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar corridas por circuito:', error);
    throw new Error('Erro ao carregar dados de corridas por circuito');
  }
};

/**
 * Busca detalhes das corridas da view vw_admin_corridas_detalhadas
 * Pode filtrar por circuito se necessário
 */
export const getAdminCorridasDetalhadas = async (circuitId?: number): Promise<AdminCorridasDetalhadas[]> => {
  try {
    let url = '/vw_admin_corridas_detalhadas';
    if (circuitId) {
      url += `?circuitid=eq.${circuitId}`;
    }
    
    const { data } = await api.get<AdminCorridasDetalhadas[]>(url);
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar corridas detalhadas:', error);
    throw new Error('Erro ao carregar detalhes das corridas');
  }
};

/**
 * Função para buscar aeroportos próximos usando a função do banco
 */
export interface AeroportoProximo {
  nome_cidade: string;
  codigo_iata: string;
  nome_aeroporto: string;
  cidade_aeroporto: string;
  distancia_km: number;
  tipo: string;
}

export const getAeroportosProximos = async (cidadeNome: string): Promise<AeroportoProximo[]> => {
  try {
    const { data } = await api.post<AeroportoProximo[]>('/rpc/fn_admin_aeroportos_proximos', {
      cidade_nome: cidadeNome
    });
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar aeroportos próximos:', error);
    throw new Error('Erro ao carregar aeroportos próximos');
  }
};

/**
 * Interface e função para buscar cidades para autocomplete
 */
export interface CidadeAutocomplete {
  nome_cidade: string;
  pais: string;
}

export const buscarCidadesAutocomplete = async (busca: string): Promise<CidadeAutocomplete[]> => {
  try {
    if (!busca || busca.trim().length < 2) {
      return []; // Não buscar se o termo for muito curto
    }
    
    const { data } = await api.post<CidadeAutocomplete[]>('/rpc/fn_buscar_cidades_autocomplete', {
      busca: busca.trim()
    });
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar cidades para autocomplete:', error);
    return [];
  }
}; 