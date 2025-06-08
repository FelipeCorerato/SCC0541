import api from './api';

export interface Constructor {
  constructorid: number;
  constructorref: string;
  name: string;
  nationality: string;
  url: string;
}

const CURRENT_YEAR = new Date().getFullYear();

export const getConstructors = (year = CURRENT_YEAR): Promise<Constructor[]> =>
  api
    .get<Constructor[]>(`/constructors`)
    .then(res => res.data);
