import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaLaptop, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer-ts">
      <Container>
        <Row className="g-4">

          {/* Marca */}
          <Col md={4}>
            <div className="d-flex align-items-center gap-2 mb-2" style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
              <FaLaptop />
              TechStore
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Tu tienda de tecnologia online. Laptops, smartphones, tablets y accesorios con los mejores precios.
            </p>
            <div className="d-flex gap-3">
              <a href="https://github.com/JGastonMurua" target="_blank" rel="noreferrer">
                <FaGithub size={18} />
              </a>
              <a href="https://linkedin.com/in/jgastonmurua" target="_blank" rel="noreferrer">
                <FaLinkedin size={18} />
              </a>
              <a href="mailto:gastton.murua@gmail.com">
                <FaEnvelope size={18} />
              </a>
            </div>
          </Col>

          {/* Navegacion */}
          <Col md={2}>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              Tienda
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
              <li className="mb-1"><LinkContainer to="/productos"><a>Todos los productos</a></LinkContainer></li>
              <li className="mb-1"><LinkContainer to="/carrito"><a>Mi carrito</a></LinkContainer></li>
              <li className="mb-1"><LinkContainer to="/mi-cuenta"><a>Mi cuenta</a></LinkContainer></li>
            </ul>
          </Col>

          {/* Categorias */}
          <Col md={2}>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              Categorias
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
              <li className="mb-1"><LinkContainer to="/productos"><a>Laptops</a></LinkContainer></li>
              <li className="mb-1"><LinkContainer to="/productos"><a>Smartphones</a></LinkContainer></li>
              <li className="mb-1"><LinkContainer to="/productos"><a>Tablets</a></LinkContainer></li>
              <li className="mb-1"><LinkContainer to="/productos"><a>Accesorios</a></LinkContainer></li>
            </ul>
          </Col>

          {/* Contacto */}
          <Col md={4}>
            <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              Contacto
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, margin: 0 }}>
              gastton.murua@gmail.com<br />
              Merlo, Buenos Aires, Argentina<br />
              <a href="https://linkedin.com/in/jgastonmurua" target="_blank" rel="noreferrer">
                linkedin.com/in/jgastonmurua
              </a>
            </p>
          </Col>

        </Row>

        <hr style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '1.5rem 0 1rem' }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
          <span>© {new Date().getFullYear()} TechStore — Gaston Murua</span>
          <span style={{ opacity: 0.6 }}>Proyecto Final · Talento Tech · React 2025</span>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
