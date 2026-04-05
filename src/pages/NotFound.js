import React from 'react';
import { Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaHome, FaShoppingBag } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

function NotFound() {
  return (
    <>
      <Helmet><title>Página no encontrada - TechStore</title></Helmet>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ts-bg)' }}>
        <Container className="text-center" style={{ maxWidth: 480 }}>
          <div style={{ fontSize: '7rem', fontWeight: 900, color: 'var(--ts-purple)', lineHeight: 1, letterSpacing: -4 }}>
            404
          </div>
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem', marginTop: '0.5rem' }}>
            Página no encontrada
          </h2>
          <p style={{ color: 'var(--ts-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            La página que buscás no existe o fue movida a otro lugar.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <LinkContainer to="/">
              <button style={{
                background: 'var(--ts-purple)', border: 'none', color: 'white',
                padding: '0.65rem 1.5rem', borderRadius: 8, fontWeight: 700,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
                <FaHome size={14} /> Ir al inicio
              </button>
            </LinkContainer>
            <LinkContainer to="/productos">
              <button style={{
                background: 'var(--ts-teal)', border: 'none', color: 'white',
                padding: '0.65rem 1.5rem', borderRadius: 8, fontWeight: 700,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
                <FaShoppingBag size={14} /> Ver productos
              </button>
            </LinkContainer>
          </div>
        </Container>
      </div>
    </>
  );
}

export default NotFound;
