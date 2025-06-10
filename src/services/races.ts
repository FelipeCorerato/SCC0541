import api from './api';

// Interface baseada na função get_races do banco de dados
// que retorna: race_id, race_name, race_date, total_laps, total_time
export interface Race {
  race_id: number;
  race_name: string;
  race_date: string; // ISO date string
  total_laps: number;
  total_time: number; // tempo em milissegundos
}

/**
 * Chama a função get_races do banco de dados
 * que retorna as corridas do ano atual com informações de id, nome, data, total de voltas e tempo total
 * 
 * A função SQL retorna uma TABLE com:
 * - race_id: r.raceId
 * - race_name: r.name  
 * - race_date: r.date
 * - total_laps: COALESCE(SUM(res.laps), 0)
 * - total_time: COALESCE(SUM(res.milliseconds), 0)
 */
export const getRaces = async (): Promise<Race[]> => {
  try {
    // PostgREST permite chamar funções usando rpc/
    const { data } = await api.post<Race[]>('/rpc/get_races');
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar corridas:', error);
    throw new Error('Erro ao carregar dados das corridas');
  }
};
