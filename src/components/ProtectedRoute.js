import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import { FaLock, FaSignInAlt, FaExclamationTriangle } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

// Componente para rutas que requieren autenticación
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs="auto" className="text-center">
            <Spinner animation="border" role="status" variant="primary" className="mb-3">
              <span className="visually-hidden">Verificando autenticación...</span>
            </Spinner>
            <div className="text-muted">
              Verificando autenticación...
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si requiere admin y no es admin, mostrar error
  if (requireAdmin && !isAdmin()) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="mb-4" style={{ fontSize: '4rem', color: '#dc3545' }}>
              <FaExclamationTriangle />
            </div>
            <h2 className="text-danger mb-3">Acceso Denegado</h2>
            <p className="text-muted mb-4">
              No tienes permisos para acceder a esta sección. 
              Se requieren privilegios de administrador.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <LinkContainer to="/">
                <Button variant="primary">
                  Ir al Inicio
                </Button>
              </LinkContainer>
              <LinkContainer to="/productos">
                <Button variant="outline-secondary">
                  Ver Productos
                </Button>
              </LinkContainer>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Si todo está bien, renderizar el contenido
  return children;
}

// Componente para mostrar mensaje de login requerido
export function LoginRequired({ message = "Inicia sesión para continuar" }) {
  const location = useLocation();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <div className="mb-4" style={{ fontSize: '4rem', color: '#6c757d' }}>
            <FaLock />
          </div>
          <h3 className="mb-3">Acceso Restringido</h3>
          <p className="text-muted mb-4">{message}</p>
          
          <div className="d-flex gap-2 justify-content-center">
            <LinkContainer to="/login" state={{ from: location }}>
              <Button variant="primary" size="lg">
                <FaSignInAlt className="me-2" />
                Iniciar Sesión
              </Button>
            </LinkContainer>
            <LinkContainer to="/register">
              <Button variant="outline-secondary">
                Crear Cuenta
              </Button>
            </LinkContainer>
          </div>

          <Alert variant="info" className="mt-4">
            <small>
              <strong>Usuarios de prueba:</strong><br />
              Admin: admin@techstore.com / admin123<br />
              Usuario: usuario@techstore.com / user123
            </small>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

// Componente para rutas públicas que redirigen si ya estás logueado
export function PublicRoute({ children, redirectTo = "/" }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs="auto" className="text-center">
            <Spinner animation="border" role="status" variant="primary" className="mb-3">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  // Si ya está autenticado, redirigir
  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si no está autenticado, mostrar el contenido
  return children;
}