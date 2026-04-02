import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaShoppingCart, FaArrowLeft, FaCheck, FaTruck, FaShieldAlt, FaUndo, FaTag } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => String(p.id) === String(id));
      if (found) {
        setProduct(found);
      } else {
        navigate('/productos');
      }
    }
  }, [products, id, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const currentQty = getItemQuantity(product.id);
    if (currentQty >= (product.stock || 0)) return;
    addToCart(product);
  };

  if (loading || !product) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: 'var(--ts-primary)' }} />
      </Container>
    );
  }

  const availableStock = product.stock || 0;
  const currentQty = getItemQuantity(product.id);
  const canAdd = currentQty < availableStock;
  const outOfStock = availableStock === 0;
  const shippingFree = product.precio > 50000;

  return (
    <>
      <Helmet>
        <title>{product.nombre} - TechStore</title>
        <meta name="description" content={product.descripcion || product.nombre} />
      </Helmet>

      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--ts-border)', padding: '0.6rem 0' }}>
        <Container>
          <nav style={{ fontSize: '0.82rem', color: 'var(--ts-text-muted)' }}>
            <LinkContainer to="/"><a style={{ color: 'var(--ts-primary)', textDecoration: 'none' }}>Inicio</a></LinkContainer>
            <span className="mx-2">›</span>
            <LinkContainer to="/productos"><a style={{ color: 'var(--ts-primary)', textDecoration: 'none' }}>Productos</a></LinkContainer>
            {product.categoria && (
              <>
                <span className="mx-2">›</span>
                <span>{product.categoria}</span>
              </>
            )}
            <span className="mx-2">›</span>
            <span style={{ color: 'var(--ts-text)' }}>{product.nombre}</span>
          </nav>
        </Container>
      </div>

      {/* Contenido principal */}
      <div style={{ background: 'white', minHeight: '80vh' }}>
        <Container className="py-4">

          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: 'var(--ts-primary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <FaArrowLeft size={12} />
            Volver
          </button>

          <Row className="g-5">

            {/* Imagen */}
            <Col lg={5}>
              <div style={{
                background: '#fafafa',
                borderRadius: 12,
                border: '1px solid var(--ts-border)',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 360
              }}>
                <img
                  src={product.imagen || 'https://via.placeholder.com/400x400?text=Sin+Imagen'}
                  alt={product.nombre}
                  style={{ maxWidth: '100%', maxHeight: 340, objectFit: 'contain' }}
                />
              </div>
            </Col>

            {/* Info */}
            <Col lg={4}>

              {/* Marca */}
              {product.marca && (
                <div style={{ fontSize: '0.82rem', color: 'var(--ts-text-muted)', marginBottom: '0.4rem' }}>
                  {product.marca}
                </div>
              )}

              {/* Nombre */}
              <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--ts-text)', lineHeight: 1.35, marginBottom: '1rem' }}>
                {product.nombre}
              </h1>

              {/* Categoria */}
              {product.categoria && (
                <span style={{
                  background: 'var(--ts-bg)',
                  color: 'var(--ts-primary)',
                  fontSize: '0.78rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 20,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: '1.25rem'
                }}>
                  <FaTag size={10} />
                  {product.categoria}
                </span>
              )}

              {/* Precio */}
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--ts-text)', marginBottom: '0.25rem' }}>
                {formatPrice(product.precio)}
              </div>

              {/* Cuotas */}
              <div style={{ color: 'var(--ts-success)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                3 cuotas sin interes de {formatPrice(product.precio / 3)}
              </div>

              {/* Envio */}
              <div style={{ color: shippingFree ? 'var(--ts-success)' : 'var(--ts-text-muted)', fontSize: '0.85rem', fontWeight: shippingFree ? 600 : 400, marginBottom: '1.5rem' }}>
                <FaTruck size={13} className="me-1" />
                {shippingFree ? 'Envio gratis a todo el pais' : `Envio desde ${formatPrice(5000)}`}
              </div>

              {/* Stock */}
              {!outOfStock && availableStock <= 5 && (
                <div style={{ color: '#856404', background: '#FFF3CD', borderRadius: 6, padding: '0.4rem 0.75rem', fontSize: '0.82rem', marginBottom: '1rem', fontWeight: 500 }}>
                  Solo quedan {availableStock} unidades
                </div>
              )}

              {/* Descripcion */}
              {product.descripcion && (
                <p style={{ color: 'var(--ts-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {product.descripcion}
                </p>
              )}

              {/* En carrito */}
              {currentQty > 0 && (
                <div style={{ color: 'var(--ts-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaCheck size={12} />
                  {currentQty} unidad{currentQty > 1 ? 'es' : ''} en tu carrito
                </div>
              )}

              {/* Boton agregar */}
              <button
                onClick={handleAddToCart}
                disabled={outOfStock || !canAdd}
                style={{
                  width: '100%',
                  background: outOfStock || !canAdd ? '#ccc' : 'var(--ts-accent)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 700,
                  padding: '0.85rem',
                  borderRadius: 8,
                  fontSize: '1rem',
                  cursor: outOfStock || !canAdd ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: '0.75rem'
                }}
              >
                <FaShoppingCart size={16} />
                {outOfStock ? 'Sin stock' : !canAdd ? 'Stock maximo alcanzado' : 'Agregar al carrito'}
              </button>

              {/* Ir al carrito si ya tiene items */}
              {currentQty > 0 && (
                <LinkContainer to="/carrito">
                  <button style={{
                    width: '100%',
                    background: 'white',
                    border: '2px solid var(--ts-primary)',
                    color: 'var(--ts-primary)',
                    fontWeight: 600,
                    padding: '0.75rem',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}>
                    Ir al carrito
                  </button>
                </LinkContainer>
              )}
            </Col>

            {/* Panel lateral - garantias */}
            <Col lg={3}>
              <div style={{
                border: '1px solid var(--ts-border)',
                borderRadius: 10,
                padding: '1.25rem',
                position: 'sticky',
                top: '1.5rem'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Comprando con TechStore</div>
                {[
                  { icon: FaTruck,      text: 'Envio rapido a todo el pais' },
                  { icon: FaShieldAlt,  text: 'Compra 100% segura' },
                  { icon: FaUndo,       text: '30 dias para devoluciones' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="d-flex align-items-start gap-2 mb-3">
                      <Icon size={16} style={{ color: 'var(--ts-success)', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--ts-text-muted)' }}>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </Col>

          </Row>
        </Container>
      </div>
    </>
  );
}

export default ProductDetail;
