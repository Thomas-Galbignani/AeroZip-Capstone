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

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login({ email, password });
      if (reservationService.getPendingReservation() != null) {
        navigate('/reservation');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Login fallito. Controlla le credenziali.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Login</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
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
                  Login
                </Button>

                <p className="mt-3 mb-1 text-center">Oppure</p>
                <NavLink
                  to="/register"
                  className="d-block w-100 text-center aero-zip-button__secondary--small"
                >
                  Registrati
                </NavLink>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
