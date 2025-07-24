import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUser, FaShoppingCart, FaHeart, FaHistory, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function UserDashboard() {
  const { user, userName, logout } = useAuth();
  const { cartItems, getTotalItems, getTotalPrice } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Helmet>
        <title>Mi Cuenta - TechStore</title>
        <meta name="description" content="Panel de usuario de TechStore. Gestiona tu perfil y revisa tus compras." />
      </Helmet>

      <div className="bg-primary text-white py-4">
        <Container>
          <Row>
            <Col>
              <h1 className="display-6 fw-bold mb-1">
                <FaUser className="me-2" />
                Mi Cuenta
              </h1>
              <p className="mb-0 opacity-75">
                Bienvenido {userName}
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Información del usuario */}
        <Row className="mb-4">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Información Personal</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Nombre:</strong> {user?.name}</p>
                    <p><strong>Apellido:</strong> {user?.lastName}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Tipo de cuenta:</strong> 
                      <Badge bg="primary" className="ms-2">Usuario</Badge>
                    </p>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button variant="outline-primary" size="sm">
                    <FaEdit className="me-1" />
                    Editar Perfil
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Acciones Rápidas</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <LinkContainer to="/productos">
                    <Button variant="primary">
                      <FaShoppingCart className="me-2" />
                      Seguir Comprando
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/carrito">
                    <Button variant="outline-secondary">
                      Ver Carrito ({getTotalItems()})
                    </Button>
                  </LinkContainer>
                  <Button variant="outline-danger" onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Estado del carrito */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <FaShoppingCart className="me-2" />
                  Mi Carrito Actual
                </h5>
              </Card.Header>
              <Card.Body>
                {cartItems.length > 0 ? (
                  <>
                    <Alert variant="info">
                      Tienes <strong>{getTotalItems()} productos</strong> en tu carrito 
                      por un total de <strong>{formatPrice(getTotalPrice())}</strong>
                    </Alert>
                    <div className="mb-3">
                      <h6>Productos en el carrito:</h6>
                      <ul className="list-unstyled">
                        {cartItems.slice(0, 3).map(item => (
                          <li key={item.id} className="d-flex justify-content-between align-items-center py-1">
                            <span>{item.nombre} x{item.quantity}</span>
                            <span className="fw-bold">{formatPrice(item.precio * item.quantity)}</span>
                          </li>
                        ))}
                        {cartItems.length > 3 && (
                          <li className="text-muted">
                            ... y {cartItems.length - 3} productos más
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="d-flex gap-2">
                      <LinkContainer to="/carrito">
                        <Button variant="primary">
                          Ver Carrito Completo
                        </Button>
                      </LinkContainer>
                      <LinkContainer to="/productos">
                        <Button variant="outline-secondary">
                          Agregar Más Productos
                        </Button>
                      </LinkContainer>
                    </div>
                  </>
                ) : (
                  <>
                    <Alert variant="light" className="text-center">
                      <div style={{ fontSize: '2rem', opacity: 0.5 }}>🛒</div>
                      <p className="mb-2">Tu carrito está vacío</p>
                      <small className="text-muted">¡Explora nuestros productos y encuentra lo que necesitas!</small>
                    </Alert>
                    <div className="text-center">
                      <LinkContainer to="/productos">
                        <Button variant="primary">
                          Explorar Productos
                        </Button>
                      </LinkContainer>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Secciones adicionales */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">
                  <FaHistory className="me-2" />
                  Historial de Compras
                </h5>
              </Card.Header>
              <Card.Body className="text-center">
                <div style={{ fontSize: '3rem', opacity: 0.3 }}>📦</div>
                <p className="text-muted">Aún no has realizado ninguna compra</p>
                <small className="text-muted">
                  Una vez que completes tu primera compra, 
                  podrás ver tu historial aquí.
                </small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">
                  <FaHeart className="me-2" />
                  Lista de Deseos
                </h5>
              </Card.Header>
              <Card.Body className="text-center">
                <div style={{ fontSize: '3rem', opacity: 0.3 }}>❤️</div>
                <p className="text-muted">Tu lista de deseos está vacía</p>
                <small className="text-muted">
                  Próximamente podrás guardar tus productos favoritos 
                  para comprarlos más tarde.
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Información de cuenta */}
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <Row className="text-center">
                  <Col md={3}>
                    <h4 className="text-primary">0</h4>
                    <small className="text-muted">Compras Realizadas</small>
                  </Col>
                  <Col md={3}>
                    <h4 className="text-success">$0</h4>
                    <small className="text-muted">Total Gastado</small>
                  </Col>
                  <Col md={3}>
                    <h4 className="text-info">{getTotalItems()}</h4>
                    <small className="text-muted">En Carrito</small>
                  </Col>
                  <Col md={3}>
                    <h4 className="text-warning">0</h4>
                    <small className="text-muted">Productos Favoritos</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Beneficios de usuario */}
        <Row className="mt-4">
          <Col>
            <Alert variant="success">
              <h6 className="alert-heading">🎉 Beneficios de tu cuenta</h6>
              <ul className="mb-0">
                <li>Envío gratis en compras superiores a $50.000</li>
                <li>Acceso a ofertas exclusivas para usuarios registrados</li>
                <li>Seguimiento completo de tus pedidos</li>
                <li>Soporte prioritario 24/7</li>
              </ul>
            </Alert>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserDashboard;