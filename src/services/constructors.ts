import api from './api';

export interface Constructor {
  constructorid: number;
  constructorref: string;
  name: string;
  nationality: string;
  url: string;
}

export const getConstructors = (): Promise<Constructor[]> =>
  api
    .get<Constructor[]>(`/constructors`)
    .then(res => res.data);

export const createConstructor = (constructor: Omit<Constructor, 'constructorid'>) =>
  api.post<Constructor>('/constructors', constructor)
      .then(res => res.data);
