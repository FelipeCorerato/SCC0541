import api from './api';

export interface AdminSummary {
  total_driver: number;        // bigint do PostgreSQL vira number no JS/TS
  total_constructors: number;  // bigint do PostgreSQL vira number no JS/TS  
  total_seasons: number;       // bigint do PostgreSQL vira number no JS/TS
}

/**
 * Chama a função get_admin_summary do banco de dados
 * que retorna o total de pilotos, escuderias e temporadas
 * 
 * A função SQL retorna uma TABLE com uma linha contendo:
 * - total_driver: COUNT(*) FROM driver
 * - total_constructors: COUNT(*) FROM constructors  
 * - total_seasons: COUNT(*) FROM seasons
 */
export const getAdminSummary = async (): Promise<AdminSummary> => {
  try {
    // PostgREST permite chamar funções usando rpc/
    const { data } = await api.post<AdminSummary[]>('/rpc/get_admin_summary');
    
    // A função retorna um array com uma linha, pegamos o primeiro item
    if (data && data.length > 0) {
      return data[0];
    }
    
    // Fallback caso não retorne dados
    return {
      total_driver: 0,
      total_constructors: 0,
      total_seasons: 0
    };
  } catch (error) {
    console.error('Erro ao buscar resumo do admin:', error);
    throw new Error('Erro ao carregar dados do resumo');
  }
};
