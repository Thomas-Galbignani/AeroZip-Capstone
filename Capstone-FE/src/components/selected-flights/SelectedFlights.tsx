import { Button } from 'react-bootstrap';
import { LayoverType } from '../../models/layover';
import type { Flight } from '../../services/flightService';
import './SelectedFlights.scss';

export enum SelectedFlightsType {
  START_RESERVATION,
  SEAT_SELECT,
}

interface SelectedFlightCardProps {
  flight: Flight;
}

const SelectedFlightCard: React.FC<SelectedFlightCardProps> = ({ flight }) => {
  return (
    <div className="selected-flights__flights__card">
      <div className="row">
        <div className="col-xs-5">
          <img
            className="selected-flights__flights__card__logo"
            src={flight.companyAvatar}
            alt=""
          />
        </div>
        <div className="col-xs-6 d-flex flex-column">
          <span className="selected-flights__flights__card__text">
            {flight.companyName}
          </span>
          <span className="selected-flights__flights__card__text--light">
            {flight.flightCode}
          </span>
        </div>
        <div className="col-xs-4 d-flex flex-column justify-content-between">
          <span className="selected-flights__flights__card__text">
            {flight.flightTime}
          </span>
          <span className="selected-flights__flights__card__text">
            {new Date(flight.departureTime).toLocaleTimeString('it-IT', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: false,
            })}{' '}
            -{' '}
            {new Date(flight.arrivalTime).toLocaleTimeString('it-IT', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: false,
            })}
          </span>
          <span className="selected-flights__flights__card__text">
            {flight.layover == LayoverType.DIRECT
              ? 'Diretto'
              : flight.layover == LayoverType.ONE_STOP
                ? '1 scalo'
                : '2 scali'}
          </span>
        </div>
      </div>
    </div>
  );
};

interface SelectedFlightsProps {
  departingFlight?: Flight | null;
  returningFlight?: Flight | null;
  hasReturningFlight?: boolean;
  step?: SelectedFlightsType;
  onReservationClick: () => void;
  passengersNumber: number;
}

const SelectedFlights: React.FC<SelectedFlightsProps> = ({
  departingFlight = null,
  returningFlight = null,
  hasReturningFlight = false,
  step = SelectedFlightsType.START_RESERVATION,
  onReservationClick,
  passengersNumber,
}) => {
  const showInfoBox = hasReturningFlight
    ? !!departingFlight && !!returningFlight
    : !!departingFlight;

  const getTotalPrice = (): number => {
    let totalPrice = 0;
    if (!departingFlight) return totalPrice;
    totalPrice += departingFlight.totalPrice;
    if (!!returningFlight) totalPrice += returningFlight.totalPrice;
    totalPrice = totalPrice * passengersNumber;
    return totalPrice / 100;
  };

  return (
    <div className="selected-flights">
      <div className="selected-flights__flights container">
        {departingFlight && <SelectedFlightCard flight={departingFlight} />}
        {returningFlight && <SelectedFlightCard flight={returningFlight} />}
      </div>
      {showInfoBox && (
        <div className="d-flex flex-column align-items-end mt-3 me-3">
          <p className="selected-flights__info text-grey-900">
            Totale <span className="ms-3">{getTotalPrice()}€</span>
          </p>
          <Button className="aero-zip-button mt-2" onClick={onReservationClick}>
            {step == SelectedFlightsType.START_RESERVATION && 'Prenota'}
            {step == SelectedFlightsType.SEAT_SELECT && 'Seleziona posti'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectedFlights;
