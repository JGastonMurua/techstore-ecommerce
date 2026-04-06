import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaLaptop, FaShoppingBag, FaCog, FaTruck, FaLock, FaHeadset } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

function Home() {
  const { products, loading } = useProducts();
  const { isAuthenticated, isAdmin, userName } = useAuth();
  const { clearCart } = useCart();

  // Detectar retorno de MercadoPago
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === 'approved') {
      clearCart(); // Solo limpiar carrito cuando MP confirma pago exitoso
      toast.success('¡Pago aprobado! Tu pedido está en camino.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (status === 'pending') {
      toast.info('Tu pago está pendiente de acreditación.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (status === 'failure') {
      toast.error('El pago no se pudo procesar. Podés intentarlo de nuevo.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [clearCart]);

  const featuredProducts = products.slice(0, 4);

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

      {/* Hero — compacto */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              {isAuthenticated() && (
                <div className="fade-in mb-2" style={{ fontSize: '0.85rem', opacity: 0.85 }}>
                  Hola de vuelta, <strong>{userName}</strong>
                </div>
              )}
              <h1 className="fade-in">
                {isAuthenticated()
                  ? `Bienvenido, ${userName}`
                  : 'La tecnologia que buscas, al mejor precio'}
              </h1>
              <p className="lead fade-in">
                {isAdmin()
                  ? 'Gestioná tu tienda desde el panel de administracion.'
                  : 'Laptops, smartphones, tablets y accesorios. Envio a todo el pais.'}
              </p>
              <div className="d-flex flex-wrap gap-2 fade-in">
                {isAdmin() ? (
                  <>
                    <LinkContainer to="/admin">
                      <button className="btn-hero-primary"><FaCog size={13} />Panel Admin</button>
                    </LinkContainer>
                    <LinkContainer to="/productos">
                      <button className="btn-hero-secondary"><FaShoppingBag size={13} />Ver Tienda</button>
                    </LinkContainer>
                  </>
                ) : (
                  <>
                    <LinkContainer to="/productos">
                      <button className="btn-hero-primary"><FaShoppingBag size={13} />Ver Productos</button>
                    </LinkContainer>
                    {!isAuthenticated() && (
                      <LinkContainer to="/register">
                        <button className="btn-hero-secondary">Crear cuenta gratis</button>
                      </LinkContainer>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col lg={5} className="text-center d-none d-lg-flex align-items-center justify-content-end">
              <div className="fade-in" style={{ opacity: 0.35 }}>
                {isAdmin() ? <FaCog size={140} /> : <FaLaptop size={140} />}
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
