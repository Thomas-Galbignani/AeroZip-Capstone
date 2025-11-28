import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/esm/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { authService } from '../services/authService';
import { useEffect, useState } from 'react';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isAutenticated, setIsAutenticated] = useState<boolean>(
    authService.isAuthenticated()
  );

  useEffect(() => {
    document.addEventListener('login', () => {
      setIsAutenticated(authService.isAuthenticated());
    });
  }, []);

  return (
    <Navbar className="bg-white" expand={'sm'}>
      <Container>
        <Navbar.Brand>
          <NavLink
            to="/"
            className="text-purple-blue fs-3 fw-bold text-decoration-none"
          >
            AeroZip
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-sm`}
          aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
          placement="end"
        >
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body className="justify-content-end">
            <Nav className="align-items-center gap-3">
              <NavLink to="/" className="areo-zip-link p-2">
                Voli
              </NavLink>
              {!isAutenticated && (
                <>
                  <NavLink to="/login" className="areo-zip-link p-2">
                    Accedi
                  </NavLink>
                  <NavLink to="/register" className="aero-zip-button">
                    Registrati
                  </NavLink>
                </>
              )}
              {isAutenticated && (
                <NavLink to="/profile" className="aero-zip-button">
                  Profilo
                </NavLink>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
export default Header;
