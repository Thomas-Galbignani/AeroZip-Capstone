import { API_BASE_URL } from "../constants";

export type Flight = {
  id?: number;
  companyAvatar: string;
  companyName: string;
  flightTime: string;
  layover: string;
  departureTime: string;
  arrivalTime: string;
  totalPrice: number;
  businessClassCostPerPerson: number;
  departureAirportId: number;
  arrivalAirportId: number;
  date: string;
  flightCode: string;
};

export const fetchFlights = async (
  departureIata: string,
  arrivalIata: string,
  date: string,
  passengers: number
): Promise<Flight[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/flights?departureIata=${departureIata}&arrivalIata=${arrivalIata}&date=${date}&passengers=${passengers}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as Flight[];

    return data;
  } catch (error) {
    console.error('Errore nel caricamento degli aeroporti:', error);
    return [];
  }
};
