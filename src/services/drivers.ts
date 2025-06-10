import api from './api';

// Interface baseada na função get_drivers do banco de dados
// que retorna: driver_id, driver_name, total_pontos
export interface Driver {
  driver_id: number;
  driver_name: string;
  total_pontos: number;
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