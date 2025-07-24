import React from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';

function Loading({ message = "Cargando productos..." }) {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs="auto" className="text-center">
          <Spinner animation="border" role="status" variant="primary" className="mb-3">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <div className="text-muted">
            {message}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

// Componente para mostrar esqueletos de productos mientras cargan
export function ProductSkeleton() {
  return (
    <div className="card h-100">
      <div 
        className="card-img-top bg-light" 
        style={{ height: '200px' }}
      >
        <div className="d-flex align-items-center justify-content-center h-100">
          <Spinner animation="grow" size="sm" variant="secondary" />
        </div>
      </div>
      <div className="card-body">
        <div className="placeholder-glow">
          <span className="placeholder col-8 mb-2"></span>
          <span className="placeholder col-6 mb-2"></span>
          <span className="placeholder col-7"></span>
        </div>
        <div className="mt-3">
          <div className="placeholder-glow">
            <span className="placeholder col-4 mb-2"></span>
            <span className="placeholder btn btn-primary disabled col-12"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar cuando no hay productos
export function NoProducts({ message = "No se encontraron productos" }) {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <div className="mb-4" style={{ fontSize: '4rem', opacity: 0.3 }}>
            📦
          </div>
          <h4 className="text-muted mb-3">{message}</h4>
          <p className="text-muted">
            Intenta ajustar los filtros de búsqueda o explora otras categorías.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Loading;