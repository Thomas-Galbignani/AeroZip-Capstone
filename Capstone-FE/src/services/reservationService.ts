import type { SearchFlightsFormData } from '../components/search-flights/SearchFlights';
import { API_BASE_URL } from '../constants';
import { authService } from './authService';
import type { Flight } from './flightService';

const PENDING_RESERVATION = 'pending_reservation';
const RESERVATION = 'reservation';


export type PendingReservation = {
  departingFlight: Flight;
  returningFlight: Flight | null;
  searchData: SearchFlightsFormData;
};

export interface ReservationCreate {
  departingFlightId: number
  returningFlightId: number | null
  passengers: Passenger[]
}

export interface Passenger {
  name: string
  surname: string
  birthDate: string
  mail: string
  phone: string
  baggageNumber: number
  seats: Seat[]
}

export interface Seat {
  flightId: number
  seat: string
  seatClass: string
  passengerMail: string
}

export interface ReservationResponse {
  reservationId: string
  status: string
  passengers: PassengerResponse[]
}

export interface PassengerResponse {
  name: string
  surname: string
  mail: string
  seats: SeatResponse[]
}

export interface SeatResponse {
  flightId: number
  seat: string
  seatClass: string
}

const getPendingReservation = (): PendingReservation | null => {
  const data = localStorage.getItem(PENDING_RESERVATION);
  if (!data) return null;
  return JSON.parse(data);
};

const setPendingReservation = (data: PendingReservation): void => {
  localStorage.setItem(PENDING_RESERVATION, JSON.stringify(data));
};

const removePendingReservation = (): void => {
  localStorage.removeItem(PENDING_RESERVATION);
};

const getReservation = (): ReservationResponse | null => {
  const data = localStorage.getItem(RESERVATION);
  if (!data) return null;
  return JSON.parse(data);
};

const setReservation = (data: ReservationResponse) => {
  localStorage.setItem(RESERVATION, JSON.stringify(data));
};

const removeReservation = (): void => {
  localStorage.removeItem(RESERVATION);
};



const createReservation = async (reservationData: ReservationCreate): Promise<ReservationResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: new Headers({
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(reservationData)
    });

    const json = await response.json() as ReservationResponse;
    setReservation(json);
    return json;

  } catch (err) {
    console.error(err);
  }


}


export const reservationService = {
  getPendingReservation,
  setPendingReservation,
  removePendingReservation,
  createReservation,
  setReservation,
  getReservation,
  removeReservation
};
