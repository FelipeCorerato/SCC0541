import api from './api';

export interface Race {
  raceid:   number;
  year:     number;
  round:    number;
  name:     string;
  date:     string;
  time:     string | null;
  /* adicione aqui os campos da sua tabela */
}

const CURRENT_YEAR = new Date().getFullYear();

export const getRaces = (year = CURRENT_YEAR): Promise<Race[]> =>
  api
    .get<Race[]>(`/races`)
    .then(res => res.data);
