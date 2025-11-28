import { useState } from 'react';
import SeatsAirplane from './seats-airplane/SeatsAirplane';
import type {
  CheckoutInfo,
  FlightInfo,
} from '../reservation-passengers-seatClass/ReservationPassengersSeatClass';
import type { PassengerData } from '../reservation-passengers-info/ReservationPassengersInfo';
import ReservationPassengersSeatClass from '../reservation-passengers-seatClass/ReservationPassengersSeatClass';
import { SeatClass } from '../../models/seatClass';
import {
  reservationService,
  type ReservationCreate,
  type Seat,
} from '../../services/reservationService';
import { getUserData } from '../../services/userService';

interface ReservationPassengersSeatsProps {
  departingFlightInfo: FlightInfo;
  returningFlightInfo?: FlightInfo;
  passengersInfo: PassengerData[];
}

export interface SelectedSeats {
  departure: {
    seat: string;
    seatClass: string;
  };
  returning?: {
    seat: string;
    seatClass: string;
  };
}

interface ReservationPassengersSeatsProps {}

const availableSeats = [
  'A1',
  'D1',
  'A2',
  'C2',
  'D2',
  'A3',
  'C3',
  'D3',
  'A4',
  'B4',
  'C4',
  'D4',
  'A5',
  'B5',
  'C5',
  'D5',
  'C6',
  'D6',
  'F6',
  'C7',
  'D7',
  'E7',
  'F7',
  'C8',
  'F8',
  'C9',
  'D9',
  'F9',
  'B10',
  'E10',
  'B11',
  'E11',
  'F11',
  'A12',
  'B12',
  'E12',
  'F12',
  'A13',
  'B13',
  'C13',
  'D13',
  'E13',
  'F13',
  'A14',
  'B14',
  'C14',
  'D14',
  'E14',
  'F14',
  'A15',
  'B15',
  'C15',
  'D15',
  'E15',
  'F15',
  'A16',
  'B16',
  'C16',
  'D16',
  'E16',
  'F16',
  'A17',
  'B17',
  'C17',
  'D17',
  'E17',
  'F17',
  'A18',
  'B18',
  'C18',
  'D18',
  'E18',
  'F18',
  'A19',
  'B19',
  'C19',
  'D19',
  'E19',
  'F19',
  'A20',
  'F20',
  'A21',
  'B21',
  'E21',
  'F21',
  'A22',
  'B22',
  'E22',
  'F22',
  'A23',
  'B23',
  'C23',
  'D23',
  'E23',
  'F23',
  'C24',
  'D24',
  'E24',
  'F24',
  'A25',
  'B25',
  'C25',
  'D25',
  'E25',
  'F25',
  'A26',
  'B26',
  'C26',
  'D26',
  'E26',
  'F26',
  'A27',
  'B27',
  'C27',
  'D27',
  'E27',
  'F27',
  'A28',
  'B28',
  'C28',
  'D28',
  'E28',
  'F28',
  'C29',
  'D29',
  'C30',
  'D30',
  'A31',
  'B31',
  'E31',
  'F31',
  'A32',
  'B32',
  'E32',
  'F32',
  'A33',
  'B33',
  'E33',
  'F33',
];
const seatOptions = [
  {
    type: SeatClass.ECONOMY,
    title: 'Economy',
    badge: 'Selected',
    description: 'Standard comfort with essential amenities for your journey',
    features: [
      'Standard seat pitch',
      'Complimentary snacks',
      'In-flight entertainment',
    ],
    imageSrc: 'src/assets/Economy Seats.png',
  },
  {
    type: SeatClass.BUSINESS,
    title: 'Business Class',
    badge: 'Selected',
    description: 'Premium experience with enhanced comfort and service',
    features: [
      'Extra legroom',
      'Priority boarding',
      'Premium meals',
      'Lounge access',
      'Lie-flat seats',
      'Dedicated cabin crew',
    ],
    imageSrc: 'src/assets/Business Seats.png',
  },
];

const ReservationPassengersSeats: React.FC<ReservationPassengersSeatsProps> = ({
  departingFlightInfo,
  returningFlightInfo = null,
  passengersInfo,
}) => {
  const [selectedClass, setSelectedClass] = useState<SeatClass>(
    SeatClass.ECONOMY
  );
  const [selectedSeat, setSelectedSeat] = useState<string>('');

  const [passengerIndex, setPassengerIndex] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeats[]>([]);
  const [selectedFlight, setSelectedFlight] =
    useState<FlightInfo>(departingFlightInfo);
  const [isDepartingFlightSelection, setIsDepartingFlightSelection] =
    useState<boolean>(true);

  const handleClassChange = (newSelectedClass: SeatClass) => {
    setSelectedClass(newSelectedClass);
  };
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);
  const [reservedDepartingSeats, setReservedDepartingSeats] = useState<
    string[]
  >([]);
  const [reservedReturningSeats, setReservedReturningSeats] = useState<
    string[]
  >([]);

  const createReservation = async () => {
    console.log('Creazione reservation');
    const reservationCreateData: ReservationCreate = {
      departingFlightId: departingFlightInfo.id ?? 0,
      returningFlightId: returningFlightInfo?.id ?? null,
      passengers: passengersInfo.map((passenger, index) => {
        const departureSeat = selectedSeats[index].departure;
        const returningSeat = selectedSeats[index]?.returning ?? null;
        const seats: Seat[] = [
          {
            flightId: departingFlightInfo.id ?? 0,
            seat: departureSeat.seat,
            seatClass: departureSeat.seatClass,
            passengerMail: passenger.email,
          },
        ];
        if (returningSeat && returningFlightInfo) {
          seats.push({
            flightId: returningFlightInfo.id ?? 0,
            seat: returningSeat.seat,
            seatClass: returningSeat.seatClass,
            passengerMail: passenger.email,
          });
        }

        return {
          name: passenger.name,
          surname: passenger.surname,
          birthDate: passenger.birthDate,
          mail: passenger.email,
          phone: passenger.phone,
          baggageNumber: passenger.baggageNumbers,
          seats: seats,
        };
      }),
    };
    console.log(reservationCreateData);
    const response = await reservationService.createReservation(
      reservationCreateData
    );
    console.log('Create reservation response', response);

    const user = await getUserData();
    const pendingReservation = reservationService.getPendingReservation();
    if (user && pendingReservation) {
      const passengersNumber = passengersInfo.length;
      const departingAmount = pendingReservation.departingFlight.totalPrice;
      const returningAmount =
        pendingReservation.returningFlight?.totalPrice ?? null;

      const totalAmount =
        departingAmount * passengersNumber +
        (returningAmount ?? 0) * passengersNumber;

      setCheckoutInfo({
        reservationId: response?.reservationId ?? '',
        amount: totalAmount / 100,
        userEmail: user.email,
      });
    } else {
      console.error('Utente o pending reservation non trovato/a');
    }
  };

  const handleNextClick = () => {
    if (isDepartingFlightSelection) {
      setReservedDepartingSeats(old => [...old, selectedSeat]);
    } else {
      setReservedReturningSeats(old => [...old, selectedSeat]);
    }

    const tempSelectedSeats = selectedSeats;

    if (!tempSelectedSeats.length) {
      tempSelectedSeats.push({
        departure: {
          seat: selectedSeat,
          seatClass: selectedClass,
        },
      });
    } else {
      if (tempSelectedSeats[passengerIndex]?.departure) {
        tempSelectedSeats[passengerIndex].returning = {
          seat: selectedSeat,
          seatClass: selectedClass,
        };
      } else {
        tempSelectedSeats.push({
          departure: {
            seat: selectedSeat,
            seatClass: selectedClass,
          },
        });
      }
    }

    if (tempSelectedSeats[passengerIndex]?.returning) {
      if (passengerIndex < passengersInfo.length - 1) {
        setPassengerIndex(pi => ++pi);
        setSelectedFlight(departingFlightInfo);
        setIsDepartingFlightSelection(true);
      } else {
        createReservation();
      }
    } else {
      if (returningFlightInfo) {
        setSelectedFlight(returningFlightInfo);
        setIsDepartingFlightSelection(false);
      } else {
        if (passengerIndex < passengersInfo.length - 1) {
          setPassengerIndex(pi => ++pi);
        } else {
          createReservation();
        }
      }
    }

    setSelectedSeat('');
    console.log('next click', tempSelectedSeats);
    setSelectedSeats(tempSelectedSeats);
  };

  return (
    <div className="row">
      <div className="col-12 col-md-6 col-lg-5">
        <div className="d-flex justify-content-center w-100 overflow-auto p-2">
          <SeatsAirplane
            reservedSeats={
              isDepartingFlightSelection
                ? reservedDepartingSeats
                : reservedReturningSeats
            }
            availableSeats={availableSeats}
            selectedSeat={selectedSeat}
            setSelectedSeat={setSelectedSeat}
            selectedClass={selectedClass}
          ></SeatsAirplane>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-7">
        <ReservationPassengersSeatClass
          flight={selectedFlight}
          passenger={passengersInfo[passengerIndex]}
          selectedClass={selectedClass}
          onClassChange={handleClassChange}
          onNext={handleNextClick}
          seatOptions={seatOptions}
          selectedSeat={selectedSeat}
          hasReturningFlight={!!returningFlightInfo}
          isDepartingFlightSelection={isDepartingFlightSelection}
          departureDepartureDate={departingFlightInfo.departureTime}
          returningDepartureDate={returningFlightInfo?.departureTime ?? ''}
          showCheckout={checkoutInfo != null}
          checkoutInfo={checkoutInfo}
        ></ReservationPassengersSeatClass>
      </div>
    </div>
  );
};

export default ReservationPassengersSeats;
