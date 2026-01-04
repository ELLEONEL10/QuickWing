import { Flight } from './types';

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: '1',
    price: 442,
    currency: '$',
    tags: [],
    dealRating: 'AVERAGE PRICE',
    outbound: {
      departureTime: '09:55',
      arrivalTime: '14:10',
      duration: '9h 15m',
      origin: 'BER',
      destination: 'EWR',
      carrier: 'United Airlines',
      stops: 0,
    },
    inbound: {
      departureTime: '17:50',
      arrivalTime: '07:55',
      duration: '8h 05m',
      origin: 'EWR',
      destination: 'BER',
      carrier: 'United Airlines',
      stops: 0,
      isOvernight: true
    }
  },
  {
    id: '2',
    price: 893,
    currency: '$',
    tags: [],
    dealRating: 'AVERAGE PRICE',
    outbound: {
      departureTime: '09:55',
      arrivalTime: '14:10',
      duration: '9h 15m',
      origin: 'BER',
      destination: 'EWR',
      carrier: 'Lufthansa',
      stops: 0,
    },
    inbound: {
      departureTime: '18:50',
      arrivalTime: '07:55',
      duration: '8h 05m',
      origin: 'EWR',
      destination: 'BER',
      carrier: 'Lufthansa',
      stops: 1,
      stopAirports: ['MUC']
    }
  },
  {
    id: '3',
    price: 567,
    currency: '$',
    tags: [],
    dealRating: 'AVERAGE PRICE',
    outbound: {
      departureTime: '06:00',
      arrivalTime: '13:10',
      duration: '13h 10m',
      origin: 'BER',
      destination: 'JFK',
      carrier: 'Air France',
      stops: 1,
      stopAirports: ['CDG']
    },
    inbound: {
      departureTime: '17:50',
      arrivalTime: '07:55',
      duration: '8h 05m',
      origin: 'JFK',
      destination: 'BER',
      carrier: 'Air France',
      stops: 0,
      isOvernight: true
    }
  },
  {
    id: '4',
    price: 492,
    currency: '$',
    tags: [],
    dealRating: 'AVERAGE PRICE',
    outbound: {
      departureTime: '09:55',
      arrivalTime: '13:10',
      duration: '9h 15m',
      origin: 'BER',
      destination: 'EWR',
      carrier: 'Norse',
      stops: 0
    },
    inbound: {
      departureTime: '17:50',
      arrivalTime: '07:55',
      duration: '8h 05m',
      origin: 'EWR',
      destination: 'BER',
      carrier: 'Norse',
      stops: 0,
      isOvernight: true
    }
  },
  {
    id: '5',
    price: 942,
    currency: '$',
    tags: [],
    dealRating: 'AVERAGE PRICE',
    outbound: {
      departureTime: '09:55',
      arrivalTime: '14:10',
      duration: '9h 15m',
      origin: 'BER',
      destination: 'EWR',
      carrier: 'Aer Lingus',
      stops: 0
    },
    inbound: {
      departureTime: '19:50',
      arrivalTime: '07:55',
      duration: '8h 05m',
      origin: 'EWR',
      destination: 'BER',
      carrier: 'Aer Lingus',
      stops: 0,
      isOvernight: true
    }
  },
  {
    id: '6',
    price: 874,
    currency: '$',
    tags: [],
    dealRating: 'AVERAGE PRICE',
    outbound: {
      departureTime: '09:55',
      arrivalTime: '13:10',
      duration: '9h 15m',
      origin: 'BER',
      destination: 'EWR',
      carrier: 'Aegean',
      stops: 0
    },
    inbound: {
      departureTime: '17:50',
      arrivalTime: '07:55',
      duration: '8h 05m',
      origin: 'EWR',
      destination: 'BER',
      carrier: 'Aegean',
      stops: 0,
      isOvernight: true
    }
  }
];

export const AIRLINES = [
  'A.P.G. Distribution System',
  'Aegean',
  'Aer Lingus',
  'Aeroitalia',
  'Aerolineas Argentinas',
  'United Airlines',
  'Lufthansa',
  'Air France',
  'Norse',
  'Delta',
  'British Airways'
];

export const COUNTRIES = [
  'Austria',
  'Belgium',
  'Denmark',
  'Finland',
  'Germany'
];
