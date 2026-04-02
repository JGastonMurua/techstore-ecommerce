import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaLaptop, FaMobile, FaTabletAlt, FaHeadphones, FaShoppingBag, FaCog, FaTruck, FaLock, FaHeadset } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

function Home() {
  const { products, loading } = useProducts();
  const { isAuthenticated, isAdmin, userName } = useAuth();

  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: 'Laptops',      icon: FaLaptop,    slug: 'laptops' },
    { name: 'Smartphones',  icon: FaMobile,    slug: 'smartphones' },
    { name: 'Tablets',      icon: FaTabletAlt, slug: 'tablets' },
    { name: 'Accesorios',   icon: FaHeadphones,slug: 'accesorios' },
  ];

  const ventajas = [
    { icon: FaTruck,   title: 'Envio Gratis',   desc: 'En compras superiores a $50.000' },
    { icon: FaLock,    title: 'Pago Seguro',     desc: 'Transacciones 100% seguras' },
    { icon: FaHeadset, title: 'Soporte 24/7',    desc: 'Atencion al cliente siempre disponible' },
  ];

  return (
    <>
      <Helmet>
        <title>TechStore - Tu tienda de tecnologia online</title>
        <meta name="description" content="Descubre los mejores productos tecnologicos: laptops, smartphones, tablets y mas. Envio gratis y los mejores precios." />
        <meta name="keywords" content="tecnologia, laptops, smartphones, tablets, ecommerce, online" />
      </Helmet>

      {/* Hero */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center py-3">
            <Col lg={6}>
              {isAuthenticated() && (
                <div
                  className="fade-in mb-3 px-3 py-2 rounded"
                  style={{ background: 'rgba(255,255,255,0.15)', display: 'inline-block' }}
                >
                  Hola, <strong>{userName}</strong>
                </div>
              )}
              <h1 className="display-4 fw-bold mb-3 fade-in">
                {isAuthenticated()
                  ? `Bienvenido de vuelta, ${userName}`
                  : 'La tecnologia que buscas, al mejor precio'}
              </h1>
              <p className="lead mb-4 fade-in" style={{ opacity: 0.9 }}>
                {isAdmin()
                  ? 'Gestiona tu tienda y descubre las herramientas de administracion.'
                  : 'Laptops, smartphones, tablets y accesorios con envio a todo el pais.'}
              </p>
              <div className="d-flex flex-wrap gap-3 fade-in">
                {isAdmin() ? (
                  <>
                    <LinkContainer to="/admin">
                      <button className="btn btn-hero-primary">
                        <FaCog className="me-2" />
                        Panel de Admin
                      </button>
                    </LinkContainer>
                    <LinkContainer to="/productos">
                      <button className="btn btn-hero-secondary">
                        <FaShoppingBag className="me-2" />
                        Ver Tienda
                      </button>
                    </LinkContainer>
                  </>
                ) : (
                  <>
                    <LinkContainer to="/productos">
                      <button className="btn btn-hero-primary">
                        <FaShoppingBag className="me-2" />
                        Ver Productos
                      </button>
                    </LinkContainer>
                    {!isAuthenticated() && (
                      <LinkContainer to="/register">
                        <button className="btn btn-hero-secondary">
                          Crear cuenta gratis
                        </button>
                      </LinkContainer>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center d-none d-lg-block">
              <div className="fade-in">
                {isAdmin()
                  ? <FaCog size={180} style={{ opacity: 0.4 }} />
                  : <FaLaptop size={180} style={{ opacity: 0.4 }} />
                }
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Dashboard admin */}
      {isAdmin() && (
        <section className="py-4" style={{ background: 'white', borderBottom: '1px solid var(--ts-border)' }}>
          <Container>
            <h2 className="section-title mb-4">Resumen de la tienda</h2>
            <Row className="g-3">
              {[
                { label: 'Productos total',  value: products.length,                                          color: 'var(--ts-primary)' },
                { label: 'En stock',         value: products.filter(p => p.stock > 0).length,                color: 'var(--ts-success)' },
                { label: 'Poco stock',       value: products.filter(p => p.stock <= 5 && p.stock > 0).length,color: '#F59E0B' },
                { label: 'Sin stock',        value: products.filter(p => p.stock === 0).length,              color: 'var(--ts-danger)' },
              ].map((stat, i) => (
                <Col md={3} key={i}>
                  <div style={{ background: 'var(--ts-bg)', borderRadius: 10, padding: '1.25rem', textAlign: 'center', border: '1px solid var(--ts-border)' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ts-text-muted)' }}>{stat.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-4">
              <LinkContainer to="/admin">
                <Button style={{ backgroundColor: 'var(--ts-primary)', border: 'none', fontWeight: 600 }}>
                  <FaCog className="me-2" />
                  Ir al Panel Completo
                </Button>
              </LinkContainer>
            </div>
          </Container>
        </section>
      )}

      {/* Categorias */}
      <section className="py-5" style={{ background: 'white' }}>
        <Container>
          <h2 className="section-title mb-4">Categorias</h2>
          <Row className="g-3">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Col md={6} lg={3} key={i}>
                  <LinkContainer to="/productos">
                    <div
                      style={{
                        background: 'var(--ts-bg)',
                        border: '1px solid var(--ts-border)',
                        borderRadius: 10,
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ts-primary)'; e.currentTarget.style.background = '#EDE7F6'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ts-border)'; e.currentTarget.style.background = 'var(--ts-bg)'; }}
                    >
                      <Icon size={40} style={{ color: 'var(--ts-primary)', marginBottom: '0.75rem' }} />
                      <div style={{ fontWeight: 600, color: 'var(--ts-text)' }}>{cat.name}</div>
                    </div>
                  </LinkContainer>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Productos destacados */}
      <section className="py-5" style={{ background: 'var(--ts-bg)' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">Productos destacados</h2>
            <LinkContainer to="/productos">
              <Button variant="link" style={{ color: 'var(--ts-primary)', fontWeight: 600, textDecoration: 'none' }}>
                Ver todos
              </Button>
            </LinkContainer>
          </div>

          {loading ? (
            <Loading message="Cargando productos..." />
          ) : featuredProducts.length > 0 ? (
            <>
              <Row className="g-3">
                {featuredProducts.map(product => (
                  <Col md={6} lg={3} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <LinkContainer to="/productos">
                  <Button style={{ backgroundColor: 'var(--ts-primary)', border: 'none', fontWeight: 600, padding: '0.65rem 2rem' }}>
                    Ver todos los productos
                  </Button>
                </LinkContainer>
              </div>
            </>
          ) : (
            <p className="text-muted text-center">No hay productos disponibles</p>
          )}
        </Container>
      </section>

      {/* Ventajas */}
      <section className="py-5" style={{ background: 'white', borderTop: '1px solid var(--ts-border)' }}>
        <Container>
          <Row className="g-4">
            {ventajas.map((v, i) => {
              const Icon = v.icon;
              return (
                <Col md={4} className="text-center" key={i}>
                  <Icon size={36} style={{ color: 'var(--ts-primary)', marginBottom: '0.75rem' }} />
                  <h5 style={{ fontWeight: 700 }}>{v.title}</h5>
                  <p style={{ color: 'var(--ts-text-muted)', fontSize: '0.9rem', margin: 0 }}>{v.desc}</p>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* CTA registro */}
      {!isAuthenticated() && (
        <section className="py-5" style={{ background: 'var(--ts-bg)' }}>
          <Container>
            <div
              style={{
                background: 'white',
                border: '1px solid var(--ts-border)',
                borderRadius: 12,
                padding: '2.5rem',
                textAlign: 'center',
                maxWidth: 560,
                margin: '0 auto'
              }}
            >
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Nuevo en TechStore?</h4>
              <p style={{ color: 'var(--ts-text-muted)', marginBottom: '1.5rem' }}>
                Crea tu cuenta y disfrutá de descuentos exclusivos y seguimiento de pedidos.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <LinkContainer to="/register">
                  <Button style={{ backgroundColor: 'var(--ts-primary)', border: 'none', fontWeight: 600 }}>
                    Crear cuenta gratis
                  </Button>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Button variant="outline-secondary">
                    Ya tengo cuenta
                  </Button>
                </LinkContainer>
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

export default Home;
