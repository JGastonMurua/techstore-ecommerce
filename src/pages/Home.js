import React from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaLaptop, FaMobile, FaTabletAlt, FaHeadphones, FaShoppingBag, FaStar, FaCog, FaUser } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

function Home() {
  const { products, loading } = useProducts();
  const { isAuthenticated, isAdmin, userName, user } = useAuth();
  
  // Obtener productos destacados (primeros 4)
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: 'Laptops', icon: FaLaptop, color: 'primary' },
    { name: 'Smartphones', icon: FaMobile, color: 'success' },
    { name: 'Tablets', icon: FaTabletAlt, color: 'info' },
    { name: 'Accesorios', icon: FaHeadphones, color: 'warning' }
  ];

  return (
    <>
      <Helmet>
        <title>TechStore - Tu tienda de tecnología online</title>
        <meta name="description" content="Descubre los mejores productos tecnológicos: laptops, smartphones, tablets y más. Envío gratis y los mejores precios." />
        <meta name="keywords" content="tecnología, laptops, smartphones, tablets, ecommerce, online" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section text-white">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              {/* Mensaje personalizado según autenticación */}
              {isAuthenticated() ? (
                <div className="fade-in">
                  <Alert variant="light" className="mb-4">
                    <FaUser className="me-2" />
                    <strong>¡Hola {userName}!</strong>
                    {isAdmin() ? (
                      <span> Bienvenido al panel de administración.</span>
                    ) : (
                      <span> ¡Bienvenido de vuelta a TechStore!</span>
                    )}
                  </Alert>
                </div>
              ) : null}
              
              <h1 className="display-4 fw-bold mb-4 fade-in">
                {isAuthenticated() ? `Bienvenido ${userName}` : 'Bienvenido a TechStore'}
              </h1>
              <p className="lead mb-4 fade-in">
                {isAdmin() ? 
                  'Gestiona tu tienda y descubre las herramientas de administración más potentes.' :
                  'Descubre los últimos productos tecnológicos con los mejores precios y la calidad que mereces.'
                }
              </p>
              <div className="fade-in">
                {isAdmin() ? (
                  <>
                    <LinkContainer to="/admin">
                      <Button variant="light" size="lg" className="me-3 mb-2">
                        <FaCog className="me-2" />
                        Panel de Admin
                      </Button>
                    </LinkContainer>
                    <LinkContainer to="/productos">
                      <Button variant="outline-light" size="lg" className="mb-2">
                        <FaShoppingBag className="me-2" />
                        Ver Tienda
                      </Button>
                    </LinkContainer>
                  </>
                ) : (
                  <>
                    <LinkContainer to="/productos">
                      <Button variant="light" size="lg" className="me-3 mb-2">
                        <FaShoppingBag className="me-2" />
                        Ver Productos
                      </Button>
                    </LinkContainer>
                    {!isAuthenticated() && (
                      <LinkContainer to="/login">
                        <Button variant="outline-light" size="lg" className="mb-2">
                          Iniciar Sesión
                        </Button>
                      </LinkContainer>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="fade-in">
                {isAdmin() ? (
                  <FaCog size={200} className="text-white opacity-75" />
                ) : (
                  <FaLaptop size={200} className="text-white opacity-75" />
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Panel de Admin Dashboard (Solo para administradores) */}
      {isAdmin() && (
        <section className="py-5 bg-light">
          <Container>
            <Row>
              <Col className="text-center mb-4">
                <h2 className="display-6 fw-bold">Dashboard de Administración</h2>
                <p className="lead text-muted">Resumen rápido de tu tienda</p>
              </Col>
            </Row>
            <Row className="g-4">
              <Col md={3}>
                <Card className="text-center border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="text-primary">{products.length}</h3>
                    <p className="text-muted mb-0">Productos Total</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="text-success">{products.filter(p => p.stock > 0).length}</h3>
                    <p className="text-muted mb-0">En Stock</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="text-warning">{products.filter(p => p.stock <= 5 && p.stock > 0).length}</h3>
                    <p className="text-muted mb-0">Poco Stock</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-0 shadow-sm">
                  <Card.Body>
                    <h3 className="text-danger">{products.filter(p => p.stock === 0).length}</h3>
                    <p className="text-muted mb-0">Sin Stock</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col className="text-center">
                <LinkContainer to="/admin">
                  <Button variant="primary" size="lg">
                    <FaCog className="me-2" />
                    Ir al Panel Completo
                  </Button>
                </LinkContainer>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Categorías */}
      <section className={`py-5 ${isAdmin() ? '' : 'bg-light'}`}>
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <h2 className="display-6 fw-bold">Nuestras Categorías</h2>
              <p className="lead text-muted">
                Explora nuestra amplia gama de productos tecnológicos
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Col md={6} lg={3} key={index}>
                  <Card className="text-center h-100 border-0 shadow-sm category-card">
                    <Card.Body className="p-4">
                      <div className={`text-${category.color} mb-3`}>
                        <IconComponent size={50} />
                      </div>
                      <Card.Title className="h5">{category.name}</Card.Title>
                      <Card.Text className="text-muted">
                        Los mejores productos en {category.name.toLowerCase()}
                      </Card.Text>
                      <LinkContainer to="/productos">
                        <Button variant={`outline-${category.color}`} size="sm">
                          Ver Productos
                        </Button>
                      </LinkContainer>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Productos Destacados */}
      <section className={`py-5 ${isAdmin() ? 'bg-light' : ''}`}>
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <h2 className="display-6 fw-bold">
                <FaStar className="text-warning me-2" />
                Productos Destacados
              </h2>
              <p className="lead text-muted">
                Los productos más populares de nuestra tienda
              </p>
            </Col>
          </Row>
          
          {loading ? (
            <Loading message="Cargando productos destacados..." />
          ) : (
            <Row className="g-4">
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <Col md={6} lg={3} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))
              ) : (
                <Col className="text-center">
                  <p className="text-muted">No hay productos disponibles</p>
                  {isAdmin() && (
                    <LinkContainer to="/admin">
                      <Button variant="primary">
                        Agregar Primer Producto
                      </Button>
                    </LinkContainer>
                  )}
                </Col>
              )}
            </Row>
          )}
          
          <Row className="mt-5">
            <Col className="text-center">
              <LinkContainer to="/productos">
                <Button variant="primary" size="lg">
                  Ver Todos los Productos
                </Button>
              </LinkContainer>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Ventajas */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <div className="mb-3">
                🚚
              </div>
              <h5>Envío Gratis</h5>
              <p className="text-muted">
                En compras superiores a $50.000
              </p>
            </Col>
            <Col md={4} className="text-center">
              <div className="mb-3">
                🔒
              </div>
              <h5>Pago Seguro</h5>
              <p className="text-muted">
                Transacciones 100% seguras
              </p>
            </Col>
            <Col md={4} className="text-center">
              <div className="mb-3">
                📞
              </div>
              <h5>Soporte 24/7</h5>
              <p className="text-muted">
                Atención al cliente siempre disponible
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mensaje especial para usuarios no autenticados */}
      {!isAuthenticated() && (
        <section className="py-5">
          <Container>
            <Row>
              <Col className="text-center">
                <Card className="border-primary">
                  <Card.Body className="p-4">
                    <h4>¿Nuevo en TechStore?</h4>
                    <p className="text-muted mb-4">
                      Crea tu cuenta y disfruta de beneficios exclusivos, 
                      descuentos especiales y un seguimiento completo de tus pedidos.
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                      <LinkContainer to="/register">
                        <Button variant="primary">
                          Crear Cuenta Gratis
                        </Button>
                      </LinkContainer>
                      <LinkContainer to="/login">
                        <Button variant="outline-primary">
                          Ya tengo cuenta
                        </Button>
                      </LinkContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </>
  );
}

export default Home;