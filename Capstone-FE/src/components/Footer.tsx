import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-light pt-5 pb-4 border-top">
      <Container>
        <Row className="text-start">
          <Col xs={12} md={4} className="mb-4">
            <div className="fw-bold fs-5 text-purple-blue">AeroZip</div>
          </Col>
          <Col xs={6} md={4}>
            <div className="fw-bold mt-3 mb-2">About</div>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  About AeroZip
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Forum
                </a>
              </li>
            </ul>
          </Col>
          <Col xs={6} md={4}>
            <div className="fw-bold mt-3 mb-2">Support</div>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Terms of service
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Trust and safety
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Accessibility
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row className="align-items-center">
          <Col xs={12} className="text-center text-muted">
            &copy; {currentYear} AeroZip - Created by Thomas Lino Galbignani
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
