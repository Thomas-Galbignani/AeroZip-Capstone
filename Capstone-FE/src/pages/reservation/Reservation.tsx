import { useEffect, useState } from 'react';
import { reservationService } from '../../services/reservationService';
import { useNavigate } from 'react-router-dom';
import SelectedFlights, {
  SelectedFlightsType,
} from '../../components/selected-flights/SelectedFlights';
import type { Flight } from '../../services/flightService';
import { ReservationStep } from '../../models/reservation';
import ReservationPassengersInfo from '../../components/reservation-passengers-info/ReservationPassengersInfo';
import ReservationPassengersSeats from '../../components/reservation-passengers-seats/ReservationPassengersSeats';
import type { SearchFlightsFormData } from '../../components/search-flights/SearchFlights';
import type { FlightInfo } from '../../components/reservation-passengers-seatClass/ReservationPassengersSeatClass';

export interface PassengerData {
  name: string;
  surname: string;
  birthDate: string;
  email: string;
  phone: string;
  baggageNumbers: number;
}

interface ReservationProps {}

const Reservation: React.FC<ReservationProps> = () => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState<PassengerData[]>([]);
  const [reservationStep, setReservationStep] = useState<ReservationStep>(
    ReservationStep.PASSENGER_INFO
  );
  const [passengerNumbers, setPassengerNumber] = useState<number>(0);
  const [departingFlight, setDepartingFlight] = useState<Flight | null>(null);
  const [returningFlight, setReturningFlight] = useState<Flight | null>(null);
  const [searchData, setSearchData] = useState<SearchFlightsFormData | null>(
    null
  );

  useEffect(() => {
    const pendingReservationData = reservationService.getPendingReservation();
    if (pendingReservationData) {
      setPassengerNumber(pendingReservationData.searchData.passengers);
      setDepartingFlight(pendingReservationData.departingFlight);
      setReturningFlight(pendingReservationData.returningFlight);
      setSearchData(pendingReservationData.searchData);
    } else {
      navigate('/');
    }
  }, []);

  const handlePassengerInfoClick = () => {
    console.log(passengers);
    setReservationStep(ReservationStep.SEAT_SELECT);
  };

  return (
    <div className="reservation container">
      {reservationStep == ReservationStep.PASSENGER_INFO && (
        <>
          <h1 className="reservation__passengers-info__title text-purple-blue">
            Informazioni dei passeggeri
          </h1>

          <div className="d-flex">
            <ReservationPassengersInfo
              passengerNumbers={passengerNumbers}
              passengers={passengers}
              setPassengers={setPassengers}
            ></ReservationPassengersInfo>
            {/* TODO rework info */}
            <div className="d-flex ms-3 p-3 ">
              <SelectedFlights
                departingFlight={departingFlight}
                returningFlight={returningFlight}
                hasReturningFlight={!!returningFlight}
                step={SelectedFlightsType.SEAT_SELECT}
                onReservationClick={handlePassengerInfoClick}
                passengersNumber={passengerNumbers}
              ></SelectedFlights>
            </div>
          </div>
        </>
      )}

      {reservationStep == ReservationStep.SEAT_SELECT && (
        <>
          <ReservationPassengersSeats
            departingFlightInfo={
              {
                ...departingFlight,
                ...{
                  departingIata: searchData?.departureAirport?.value,
                  arrivalIata: searchData?.arrivalAirport?.value,
                  departingAirportName:
                    searchData?.departureAirport?.label.split(' - ')[1],
                  arrivalAirportName:
                    searchData?.arrivalAirport?.label.split(' - ')[1],
                },
              } as FlightInfo
            }
            returningFlightInfo={
              returningFlight
                ? ({
                    ...returningFlight,
                    ...{
                      departingIata: searchData?.arrivalAirport?.value,
                      arrivalIata: searchData?.departureAirport?.value,
                      departingAirportName:
                        searchData?.arrivalAirport?.label.split(' - ')[1],
                      arrivalAirportName:
                        searchData?.departureAirport?.label.split(' - ')[1],
                    },
                  } as FlightInfo)
                : undefined
            }
            passengersInfo={passengers}
          ></ReservationPassengersSeats>
        </>
      )}
    </div>
  );
};

export default Reservation;
