import { LayoverType } from '../../models/layover';
import type { Flight } from '../../services/flightService';
import './FlightSelection.scss';

interface FlightSelectionCardProps {
  flight: Flight;
  onCardClick: () => void;
}

const FlightSelectionCard: React.FC<FlightSelectionCardProps> = ({
  flight,
  onCardClick,
}) => {
  return (
    <div className="flight-selection__card" onClick={onCardClick}>
      <div className="row">
        <div className="col-6 col-md-1">
          <img
            className="flight-selection__card__logo"
            src={flight.companyAvatar}
            alt=""
          />
        </div>
        <div className="col-6 col-md-3 mt-2 mt-md-0 d-flex flex-column justify-content-between">
          <span className="flight-selection__card__text">
            {flight.flightTime}
          </span>
          <span className="flight-selection__card__text--light">
            {flight.companyName}
          </span>
        </div>
        <div className="col-6 col-md-3 mt-2 mt-md-0">
          <span className="flight-selection__card__text">
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
        </div>
        <div className="col-6 col-md-3 mt-2 mt-md-0">
          <span className="flight-selection__card__text">
            {flight.layover == LayoverType.DIRECT
              ? 'Diretto'
              : flight.layover == LayoverType.ONE_STOP
              ? '1 scalo'
              : '2 scali'}
          </span>
        </div>
        <div className="col-12 col-md-2 mt-2 mt-md-0">
          <span className="flight-selection__card__text">
            {flight.totalPrice / 100}€
          </span>
        </div>
      </div>
    </div>
  );
};

interface FlightSelectionProps {
  flights: Flight[];
  onFlightSelection: (flight: Flight) => void;
}

const FlightSelection: React.FC<FlightSelectionProps> = ({
  flights,
  onFlightSelection,
}) => {
  console.log(flights);

  return (
    <div className="flight-selection container">
      {flights.map(flight => (
        <FlightSelectionCard
          flight={flight}
          onCardClick={() => onFlightSelection(flight)}
        />
      ))}
    </div>
  );
};

export default FlightSelection;
