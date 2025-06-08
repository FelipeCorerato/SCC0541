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

export const getRaces = (): Promise<Race[]> =>
  api
    .get<Race[]>(`/races`)
    .then(res => res.data);
