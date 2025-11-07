import api from './axios';

export interface Airport {
  id: number;
  iata: string;
  name: string;
  city: string;
  country: string;
}

export const searchAirports = (q: string) =>
  api.get<Airport[]>('/api/v1/airports/search', { params: { q } })
     .then(r => r.data);
