import api from './api';

export interface Driver {
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

export const getDrivers = (): Promise<Driver[]> =>
  api
    .get<Driver[]>(`/driver?order=surname.asc`)
    .then(res => res.data);

export const createDriver = (driver: Omit<Driver, 'driverid'>) =>
  api.post<Driver>('/driver', driver)
      .then(res => res.data);