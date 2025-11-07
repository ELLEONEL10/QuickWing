import api from './axios';

export interface Flight {
  airline: { name: string };
  flight:  { number: string; iata: string };
  departure: { airport: string; scheduled: string };
  arrival:   { airport: string; scheduled: string };
  flight_date: string;
  flight_status: string;
}

export const searchFlights = (params: {
  origin?: string;
  destination?: string;
  date?: string;          // YYYY-MM-DD
}) =>
  api.get<Flight[]>('/api/v1/flights/search', { params })
     .then(r => r.data);
