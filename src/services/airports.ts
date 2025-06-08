import api from './api';

export interface Airport {
  id: number;
  ident: string;
  type: string;
  name: string;
  latitude_deg: number;
  longitude_deg: number;
  elevation_ft: number | null;
  continent: string | null;
  iso_country: string;
  iso_region: string;
  municipality: string | null;
  gps_code: string | null;
  iata_code: string | null;
  local_code: string | null;
  home_link: string | null;
  wikipedia_link: string | null;
  keywords: string | null;
}

/**
 * Busca todos os airports (limit opcional).
 */
export const getAirports = async (limit = 100): Promise<Airport[]> => {
  const { data } = await api.get<Airport[]>(`/airports?select=*&limit=${limit}`);
  return data;
};

/**
 * Busca aeroportos filtrando por país (iso_country).
 */
export const getAirportsByCountry = async (country: string): Promise<Airport[]> => {
  const { data } = await api.get<Airport[]>(`/airports?select=*&iso_country=eq.${country}`);
  return data;
};
