import { useEffect } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';

export interface PassengerData {
  name: string;
  surname: string;
  birthDate: string;
  email: string;
  phone: string;
  baggageNumbers: number;
}

interface ReservationPassengersInfoProps {
  passengerNumbers: number;
  passengers: PassengerData[];
  setPassengers: React.Dispatch<React.SetStateAction<PassengerData[]>>;
}

const ReservationPassengersInfo: React.FC<ReservationPassengersInfoProps> = ({
  passengerNumbers,
  passengers,
  setPassengers,
}) => {
  useEffect(() => {
    setPassengers(
      Array(passengerNumbers)
        .fill(null)
        .map(() => ({
          name: '',
          surname: '',
          birthDate: '',
          email: '',
          phone: '',
          baggageNumbers: 1,
        }))
    );
  }, [passengerNumbers]);

  const handlePassengersInfoChange = (
    index: number,
    field: keyof PassengerData,
    value: string
  ) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="flex-grow-1">
      {[...Array(passengerNumbers)].map((_, index) => (
        <div key={index}>
          <h2>Passeggero {index + 1}</h2>

          <Form>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId={`nome-${index}`}>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Inserisci nome"
                    value={passengers[index]?.name || ''}
                    onChange={e =>
                      handlePassengersInfoChange(index, 'name', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId={`cognome-${index}`}>
                  <Form.Label>Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Inserisci cognome"
                    value={passengers[index]?.surname || ''}
                    onChange={e =>
                      handlePassengersInfoChange(
                        index,
                        'surname',
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId={`dataNascita-${index}`}>
                  <Form.Label>Data di nascita</Form.Label>
                  <Form.Control
                    type="date"
                    value={passengers[index]?.birthDate || ''}
                    onChange={e =>
                      handlePassengersInfoChange(
                        index,
                        'birthDate',
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId={`email-${index}`}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Inserisci email"
                    value={passengers[index]?.email || ''}
                    onChange={e =>
                      handlePassengersInfoChange(index, 'email', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId={`telefono-${index}`}>
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Inserisci telefono"
                    value={passengers[index]?.phone || ''}
                    onChange={e =>
                      handlePassengersInfoChange(index, 'phone', e.target.value)
                    }
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId={`bag-${index}`}>
                  <Form.Label>Numero bagagli</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Inserisci Il numero dei bagagli"
                    value={passengers[index]?.baggageNumbers || 1}
                    onChange={e =>
                      handlePassengersInfoChange(
                        index,
                        'baggageNumbers',
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      ))}
    </div>
  );
};

export default ReservationPassengersInfo;
