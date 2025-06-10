import api from './api';

// Interface baseada na função get_drivers do banco de dados
// que retorna: driver_id, driver_name, total_pontos
export interface Driver {
  driver_id: number;
  driver_name: string;
  total_pontos: number;
}

// Interface para o resultado da função fn_piloto_estatisticas_ano_circuito
export interface PilotoEstatisticasAnoCircuito {
  ano: number;
  circuito_id: number;
  circuito_nome: string;
  total_pontos: number;
  total_vitorias: number;
  total_corridas: number;
}

/**
 * Chama a função get_drivers do banco de dados
 * que retorna os pilotos com a soma total dos pontos obtidos nas corridas do ano atual
 * 
 * A função SQL retorna uma TABLE com:
 * - driver_id: d.driverId
 * - driver_name: d.forename || ' ' || d.surname
 * - total_pontos: SUM(res.points)::DOUBLE PRECISION
 */
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    // PostgREST permite chamar funções usando rpc/
    const { data } = await api.post<Driver[]>('/rpc/get_drivers');
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar pilotos:', error);
    throw new Error('Erro ao carregar dados dos pilotos');
  }
};

/**
 * Chama a função fn_piloto_estatisticas_ano_circuito do banco de dados
 * que retorna estatísticas do piloto por ano e circuito
 * 
 * A função SQL retorna uma TABLE com:
 * - ano: r.year
 * - circuito_id: r.circuitId
 * - circuito_nome: c.name
 * - total_pontos: COALESCE(SUM(res.points)::double precision, 0)
 * - total_vitorias: COUNT(CASE WHEN res.positionOrder = 1 THEN 1 END)
 * - total_corridas: COUNT(DISTINCT res.raceId)
 */
export const getPilotoEstatisticasAnoCircuito = async (driverId: number): Promise<PilotoEstatisticasAnoCircuito[]> => {
  try {
    const { data } = await api.post<PilotoEstatisticasAnoCircuito[]>('/rpc/fn_piloto_estatisticas_ano_circuito', {
      driver_id: driverId
    });
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar estatísticas do piloto por ano e circuito:', error);
    throw new Error('Erro ao carregar estatísticas do piloto');
  }
};

// Manter a interface original para compatibilidade com outras partes do sistema
export interface DriverOriginal {
  driverid: number;
  driverref: string;
  number: number;
  code: string;
  forename: string;
  surname: string;
  dob: string; // ISO date string
  nationality: string;
  url: string;
}

export const searchDriversByName = (name: string): Promise<DriverOriginal[]> =>
  api
    .get<DriverOriginal[]>(`/driver?or=(forename.ilike.*${name}*,surname.ilike.*${name}*)&order=surname.asc`)
    .then(res => res.data);

export const createDriver = (driver: Omit<DriverOriginal, 'driverid'>) =>
  api.post<DriverOriginal>('/driver', driver)
      .then(res => res.data);