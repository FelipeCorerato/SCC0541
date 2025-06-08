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

const CURRENT_YEAR = new Date().getFullYear();

export const getDrivers = (year = CURRENT_YEAR): Promise<Driver[]> =>
  api
    .get<Driver[]>(`/driver?order=surname.asc`)
    .then(res => res.data);
