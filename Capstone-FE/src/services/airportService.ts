import { API_BASE_URL } from '../constants';
import type { Airport } from '../models/airport';

export type AirportOption = {
  value: string;
  label: string;
};

export const fetchAirports = async (
  query: string
): Promise<AirportOption[]> => {
  try {
    const response = await fetch(
      //`/mock/airports.json?query=${encodeURIComponent(query)}`
      // Quando passi al backend reale:
      `${API_BASE_URL}/api/airports?search=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as Airport[];

    return data.map(airport => ({
      value: airport.iataCode,
      label: `${airport.iataCode} - ${airport.airportName}`,
    }));
  } catch (error) {
    console.error('Errore nel caricamento degli aeroporti:', error);
    return [];
  }
};
