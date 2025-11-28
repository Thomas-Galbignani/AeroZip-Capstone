import './SearchFlights.scss';
import { useState, useCallback, useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import AsyncSelect from 'react-select/async';
import {
  fetchAirports,
  type AirportOption,
} from '../../services/airportService';
import type { GroupBase, StylesConfig } from 'react-select';

export type SearchFlightsFormData = {
  departureAirport: AirportOption | null;
  arrivalAirport: AirportOption | null;
  departureDate: string;
  returnDate: string;
  passengers: number;
};

interface SearchFlightsProps {
  onFlightSearch: (data: SearchFlightsFormData) => void;
}

const SearchFlights: React.FC<SearchFlightsProps> = ({ onFlightSearch }) => {
  const [formData, setSearchFlightsFormData] = useState<SearchFlightsFormData>({
    departureAirport: null,
    arrivalAirport: null,
    departureDate: '',
    returnDate: '',
    passengers: 1,
  });

  const debounceTimeout = useRef<number | null>(null);

  const debouncedLoadOptions = useCallback(
    (inputValue: string, callback: (options: AirportOption[]) => void) => {
      if (debounceTimeout.current && (!inputValue || inputValue.length <= 0)) {
        clearTimeout(debounceTimeout.current);
      }

      if (!inputValue || inputValue.length <= 0) {
        return [];
      }

      debounceTimeout.current = setTimeout(async () => {
        const options = await fetchAirports(inputValue);
        callback(options);
      }, 1000);
    },
    []
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    onFlightSearch(formData);
  };

  const customStyles: StylesConfig<
    AirportOption,
    false,
    GroupBase<AirportOption>
  > = {
    menu: provided => ({
      ...provided,
      zIndex: 2,
    }),
  };

  const colxl = 2;
  const colmd = 4;
  const colsm = 6;

  return (
    <Container className="search-flights mt-5">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xl={colxl} md={colmd} sm={colsm}>
            <Form.Group className="d-flex flex-column justify-content-between align-items-strech h-100">
              <Form.Label>Aeroporto di partenza</Form.Label>
              <AsyncSelect<AirportOption, false>
                cacheOptions={false}
                defaultOptions={false}
                loadOptions={debouncedLoadOptions}
                onChange={option =>
                  setSearchFlightsFormData({
                    ...formData,
                    departureAirport: option,
                  })
                }
                value={formData.departureAirport}
                placeholder="Da dove parti?"
                noOptionsMessage={() => 'Nessun aeroporto trovato'}
                loadingMessage={() => 'Ricerca in corso...'}
                styles={customStyles}
                isClearable
              />
            </Form.Group>
          </Col>
          <Col xl={colxl} md={colmd} sm={colsm}>
            <Form.Group className="d-flex flex-column justify-content-between align-items-strech h-100 pt-3 pt-md-0">
              <Form.Label>Aeroporto di arrivo</Form.Label>
              <AsyncSelect<AirportOption, false>
                cacheOptions={false}
                defaultOptions={false}
                loadOptions={debouncedLoadOptions}
                onChange={option =>
                  setSearchFlightsFormData({
                    ...formData,
                    arrivalAirport: option,
                  })
                }
                value={formData.arrivalAirport}
                placeholder="Destinazione?"
                noOptionsMessage={() => 'Nessun aeroporto trovato'}
                loadingMessage={() => 'Ricerca in corso...'}
                styles={customStyles}
                isClearable
              />
            </Form.Group>
          </Col>
          <Col xl={colxl} md={colmd} sm={colsm}>
            <Form.Group className="d-flex flex-column justify-content-between align-items-start h-100 pt-3 pt-md-0">
              <Form.Label>Data di partenza</Form.Label>
              <Form.Control
                type="date"
                value={formData.departureDate}
                onChange={e =>
                  setSearchFlightsFormData({
                    ...formData,
                    departureDate: e.target.value,
                  })
                }
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
          </Col>
          <Col xl={colxl} md={colmd} sm={colsm}>
            <Form.Group className="d-flex flex-column justify-content-between align-items-start h-100 pt-3 pt-xl-0">
              <Form.Label>Data di ritorno (opzionale)</Form.Label>
              <Form.Control
                type="date"
                value={formData.returnDate}
                onChange={e =>
                  setSearchFlightsFormData({
                    ...formData,
                    returnDate: e.target.value,
                  })
                }
                min={
                  formData.departureDate ||
                  new Date().toISOString().split('T')[0]
                }
                disabled={!formData.departureDate}
              />
            </Form.Group>
          </Col>
          <Col xl={colxl} md={colmd} sm={colsm}>
            <Form.Group className="d-flex flex-column justify-content-between align-items-start h-100 pt-3 pt-xl-0">
              <Form.Label>Numero di passeggeri</Form.Label>
              <Form.Select
                value={formData.passengers}
                onChange={e =>
                  setSearchFlightsFormData({
                    ...formData,
                    passengers: parseInt(e.target.value),
                  })
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'passeggero' : 'passeggeri'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col
            xl={colxl}
            md={colmd}
            sm={colsm}
            className="d-flex align-items-end pt-3 pt-sm-0"
          >
            <Button
              variant="primary"
              type="submit"
              className="w-100 aero-zip-button"
            >
              Cerca voli
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};
export default SearchFlights;
