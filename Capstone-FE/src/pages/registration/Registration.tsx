import React, { useState } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { reservationService } from '../../services/reservationService';

interface RegistrationProps { }

const Registration: React.FC<RegistrationProps> = () => {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [cellulare, setCellulare] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await authService.register({ name: nome, surname: cognome, phone: cellulare, email, password });
      if (reservationService.getPendingReservation() != null) {
        navigate('/reservation');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Registrazione fallita. Riprova.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Registrazione
              </Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formNome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Inserisci il tuo nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCognome">
                  <Form.Label>Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Inserisci il tuo cognome"
                    value={cognome}
                    onChange={e => setCognome(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCellulare">
                  <Form.Label>Cellulare</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Inserisci il tuo numero di cellulare"
                    value={cellulare}
                    onChange={e => setCellulare(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Inserisci la tua email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Inserisci la tua password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 aero-zip-button"
                >
                  Registrati
                </Button>

                <p className="mt-3 mb-1 text-center">Hai già un account?</p>
                <NavLink
                  to="/login"
                  className="d-block w-100 text-center aero-zip-button__secondary--small"
                >
                  Accedi
                </NavLink>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
