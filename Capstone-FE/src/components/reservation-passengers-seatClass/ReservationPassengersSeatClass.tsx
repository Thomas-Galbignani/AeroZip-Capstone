import './ReservationPassengersSeatClass.scss';
import { SeatClass } from '../../models/seatClass';
import type { Flight } from '../../services/flightService';
import type { PassengerData } from '../../pages/reservation/Reservation';
import StripeCheckoutButton from '../StripeCheckoutButton/StripeCheckoutButton';

interface SeatOption {
  type: SeatClass;
  title: string;
  badge?: string;
  description: string;
  imageSrc: string;
  features: string[];
}
export type FlightInfo = Flight & {
  departingIata: string;
  departingAirportName: string;
  arrivalIata: string;
  arrivalAirportName: string;
};

export type CheckoutInfo = {
  reservationId: string;
  userEmail: string;
  amount: number;
};

// interface FlightInfo {
//   from: string;
//   to: string;
//   fromLocation: string;
//   toLocation: string;
//   departureTime: string;
//   departureLabel: string;
//   arrivalTime: string;
//   arrivalLabel: string;
// }

// interface Passenger {
//   name: string;
//   seatNumber: string;
// }

interface Props {
  flight: FlightInfo;
  passenger: PassengerData;
  selectedClass: SeatClass;
  onClassChange: (type: SeatClass) => void;
  onNext: () => void;
  seatOptions: SeatOption[];
  selectedSeat: string;
  hasReturningFlight: boolean;
  isDepartingFlightSelection: boolean;
  departureDepartureDate: string;
  returningDepartureDate: string;
  showCheckout: boolean;
  checkoutInfo: CheckoutInfo | null;
}

const ReservationPassengersSeatClass: React.FC<Props> = ({
  flight,
  passenger,
  selectedClass,
  onClassChange,
  onNext,
  seatOptions,
  selectedSeat,
  hasReturningFlight,
  isDepartingFlightSelection,
  departureDepartureDate,
  returningDepartureDate,
  showCheckout,
  checkoutInfo,
}) => {
  return (
    <div className="reservation-content">
      {/* Progress step header */}
      <div className="progress-step-header">
        <div className="flight-information p-4">
          <div className="flight-info-box">
            <div className="code">
              {flight.departingIata}
              <div className="arrow-icon ms-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M6 16H26M26 16L19 9M26 16L19 23"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="location">{flight.departingAirportName}</div>
          </div>

          <div className="flight-info-box">
            <div className="code">{flight.arrivalIata}</div>
            <div className="location">{flight.arrivalAirportName}</div>
          </div>
        </div>

        <div className="progress-step">
          <div className="flight-info-divider">
            <div className="divider"></div>
          </div>
          <div
            className={
              'flight-info' + (isDepartingFlightSelection ? ' active' : '')
            }
          >
            <div className="flight-info-inactive">
              <div className="time-data">
                {departureDepartureDate.replace('T', ' ')}
              </div>
              <div className="direction">Andata</div>
            </div>
            <div className="active-chevron"></div>
          </div>
          <div className="flight-info-divider">
            <div className="divider"></div>
          </div>
          {hasReturningFlight && (
            <div
              className={
                'flight-info' + (isDepartingFlightSelection ? '' : ' active')
              }
            >
              <div className="flight-info-inactive">
                <div className="time-data">
                  {returningDepartureDate.replace('T', ' ')}
                </div>
                <div className="direction">Ritorno</div>
              </div>
              <div className="active-chevron"></div>
            </div>
          )}
        </div>
      </div>

      {/* Feature lists */}
      <div className="feature-lists">
        {seatOptions.map(option => {
          const isSelected = selectedClass === option.type;
          const isEconomy = option.type === SeatClass.ECONOMY;

          return (
            <div
              key={option.type}
              className={`feature-list ${isEconomy ? 'economy' : 'business'} ${isSelected ? 'selected' : ''}`}
              onClick={() => onClassChange(option.type)}
            >
              <img
                src={option.imageSrc}
                alt={option.title}
                className="seat-image"
              />

              <div className="feature-list-content">
                <div className="header-and-badge">
                  <div className="header">{option.title}</div>
                  {option.badge && isSelected && (
                    <div className="badge-selected">
                      <div className="label">{option.badge}</div>
                    </div>
                  )}
                </div>

                <div className="description">{option.description}</div>
                <div className="divider-thick"></div>

                {option.features.map((feature, idx) => (
                  <div key={idx} className="feature-list-bullet">
                    <div className="point-icon">
                      {isEconomy ? (
                        <div className="ellipse"></div>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 12L10 16L18 8"
                            stroke="#5CD6C0"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="bullet-text">{feature}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation footer */}
      <div className="navigation-footer">
        <div className="seat-selection-divider">
          <div className="divider"></div>
        </div>
        <div className="content">
          <div className="user-selections">
            <div className="passenger-data">
              <div className="label">Passeggero</div>
              <div className="name">{passenger.name}</div>
            </div>
            <div className="passenger-data">
              <div className="label">Posto selezionato</div>
              <div className="name">{selectedSeat}</div>
            </div>
          </div>
          <div className="button-row d-flex justify-content-end">
            {!showCheckout && (
              <button className="btn-next" onClick={onNext}>
                <span className="label">Prossimo</span>
              </button>
            )}
            {showCheckout && (
              <StripeCheckoutButton
                reservationId={checkoutInfo?.reservationId ?? ''}
                userEmail={checkoutInfo?.userEmail ?? ''}
                amount={checkoutInfo?.amount ?? 0}
              ></StripeCheckoutButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPassengersSeatClass;
