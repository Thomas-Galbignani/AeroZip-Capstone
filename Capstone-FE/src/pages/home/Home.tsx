import { useState } from 'react';
import SearchFlights, {
  type SearchFlightsFormData,
} from '../../components/search-flights/SearchFlights';
import { fetchFlights, type Flight } from '../../services/flightService';
import './Home.scss';
import FlightSelection from '../../components/flight-selection/FlightSelection';
import SelectedFlights from '../../components/selected-flights/SelectedFlights';
import { authService } from '../../services/authService';
import { reservationService } from '../../services/reservationService';
import { useNavigate } from 'react-router-dom';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [flightSearchData, setFlightSearchData] =
    useState<SearchFlightsFormData | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedDepartingFlight, setSelectedDepartingFlight] =
    useState<Flight | null>(null);
  const [selectedReturningFlight, setSelectedReturningFlight] =
    useState<Flight | null>(null);

  const navigate = useNavigate();

  const hasReturningFlight =
    !!flightSearchData && flightSearchData.returnDate.length > 0;

  const onFlightSearchHandler = (data: SearchFlightsFormData) => {
    setFlights([]);
    setSelectedDepartingFlight(null);
    setSelectedReturningFlight(null);
    setFlightSearchData(data);

    const departureAirport = data.departureAirport?.value;
    const arrivalAirport = data.arrivalAirport?.value;

    if (departureAirport && arrivalAirport) {
      fetchFlights(
        departureAirport,
        arrivalAirport,
        data.departureDate,
        data.passengers
      ).then(flights => setFlights(flights));
    } else {
      console.error('departureAirport or arrivalAirport does not exist');
    }
  };

  const onFlightSelection = async (flight: Flight) => {
    if (!selectedDepartingFlight || !hasReturningFlight) {
      setSelectedDepartingFlight(flight);
      setFlights([]);
      if (flightSearchData) {
        const departureAirport = flightSearchData.departureAirport?.value;
        const arrivalAirport = flightSearchData.arrivalAirport?.value;
        fetchFlights(
          arrivalAirport ?? '',
          departureAirport ?? '',
          flightSearchData.departureDate,
          flightSearchData.passengers
        ).then(flights => setFlights(flights));
        console.log('Chiedo voli di ritorno');
      }
    } else {
      setSelectedReturningFlight(flight);
    }
  };

  const handleReservationClick = () => {
    if (!!selectedDepartingFlight && !!flightSearchData) {
      reservationService.setPendingReservation({
        departingFlight: selectedDepartingFlight,
        returningFlight: selectedReturningFlight,
        searchData: flightSearchData,
      });
    }
    if (authService.isAuthenticated()) {
      navigate('/reservation');
    } else {
      alert(
        'È necessario effettuare il login per proseguire con la prenotazione'
      );
      navigate('/login');
    }
  };

  return (
    <div className="home w-100">
      <h1 className="home__title">It’s more than just a trip</h1>

      <SearchFlights onFlightSearch={onFlightSearchHandler} />

      {flights.length > 0 && (
        <div className="container mt-5">
          <h4 className="home__flight-selection__text">
            Seleziona il volo
            {hasReturningFlight &&
              (!!selectedDepartingFlight ? ' di ritorno' : ' di andata')}
          </h4>
        </div>
      )}

      <div className="container mt-3">
        <div className="d-flex gap-3">
          <div className="flex-grow-1">
            {flights.length > 0 && (
              <FlightSelection
                flights={flights}
                onFlightSelection={onFlightSelection}
              />
            )}
          </div>
          {selectedDepartingFlight && (
            <div>
              <SelectedFlights
                departingFlight={selectedDepartingFlight}
                returningFlight={selectedReturningFlight}
                hasReturningFlight={hasReturningFlight}
                onReservationClick={handleReservationClick}
                passengersNumber={flightSearchData?.passengers ?? 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
