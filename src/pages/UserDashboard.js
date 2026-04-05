import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUser, FaShoppingCart, FaHeart, FaHistory, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const { user, userName, logout } = useAuth();
  const { cartItems, getTotalItems, getTotalPrice } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  return (
    <>
      <Helmet>
        <title>Mi Cuenta - TechStore</title>
        <meta name="description" content="Panel de usuario de TechStore." />
      </Helmet>

      {/* Header */}
      <div className="account-header">
        <Container>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaUser size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{userName}</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.75 }}>{user?.email}</div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        {/* Stats */}
        <Row className="g-3 mb-4">
          {[
            { label: 'En carrito', value: getTotalItems(), color: 'var(--ts-purple)' },
            { label: 'Total carrito', value: formatPrice(getTotalPrice()), color: 'var(--ts-success)' },
            { label: 'Favoritos', value: wishlist.length, color: '#E53935' },
            { label: 'Compras', value: 0, color: 'var(--ts-teal)' },
          ].map((stat, i) => (
            <Col xs={6} md={3} key={i}>
              <div className="account-card">
                <div className="account-stat">
                  <div className="account-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="account-stat-label">{stat.label}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* Columna izquierda */}
          <Col lg={8}>

            {/* Carrito actual */}
            <div className="account-card mb-4">
              <div className="account-card-header">
                <FaShoppingCart size={14} style={{ color: 'var(--ts-teal)' }} /> Mi carrito actual
              </div>
              <div className="account-card-body">
                {cartItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--ts-text-muted)' }}>
                    <FaShoppingCart size={32} style={{ opacity: 0.25, marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Tu carrito esta vacio</p>
                  </div>
                ) : (
                  <>
                    {cartItems.slice(0, 4).map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--ts-border-light)' }}>
                        <img src={item.imagen} alt={item.nombre} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 6, background: '#fafafa', border: '1px solid var(--ts-border-light)', flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--ts-text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.nombre}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--ts-text-muted)', flexShrink: 0 }}>x{item.quantity}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{formatPrice(item.precio * item.quantity)}</span>
                      </div>
                    ))}
                    {cartItems.length > 4 && (
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--ts-text-muted)' }}>
                        ... y {cartItems.length - 4} productos mas
                      </p>
                    )}
                    <div className="d-flex gap-2 mt-3">
                      <LinkContainer to="/carrito">
                        <button style={{ background: 'var(--ts-teal)', border: 'none', color: 'white', padding: '0.5rem 1.25rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                          Ver carrito
                        </button>
                      </LinkContainer>
                      <LinkContainer to="/checkout">
                        <button style={{ background: 'var(--ts-purple)', border: 'none', color: 'white', padding: '0.5rem 1.25rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                          Finalizar compra
                        </button>
                      </LinkContainer>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Historial de compras */}
            <div className="account-card">
              <div className="account-card-header">
                <FaHistory size={13} style={{ color: 'var(--ts-teal)' }} /> Historial de compras
              </div>
              <div className="account-card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                <FaHistory size={32} style={{ color: 'var(--ts-border)', marginBottom: 10 }} />
                <p style={{ color: 'var(--ts-text-muted)', fontSize: '0.9rem', margin: 0 }}>Aun no realizaste ninguna compra</p>
                <LinkContainer to="/productos">
                  <button style={{ marginTop: '1rem', background: 'var(--ts-teal)', border: 'none', color: 'white', padding: '0.5rem 1.5rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                    Ver productos
                  </button>
                </LinkContainer>
              </div>
            </div>
          </Col>

          {/* Columna derecha */}
          <Col lg={4}>

            {/* Info personal */}
            <div className="account-card mb-4">
              <div className="account-card-header">
                <FaUser size={13} style={{ color: 'var(--ts-teal)' }} /> Informacion personal
              </div>
              <div className="account-card-body" style={{ fontSize: '0.85rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--ts-text-muted)' }}>Nombre: </span>
                  <strong>{user?.name} {user?.lastName}</strong>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--ts-text-muted)' }}>Email: </span>
                  <strong>{user?.email}</strong>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--ts-text-muted)' }}>Cuenta: </span>
                  <span style={{ background: 'var(--ts-purple)', color: 'white', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 20, fontWeight: 600 }}>Usuario</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', background: 'none', border: '1px solid var(--ts-border)', color: 'var(--ts-danger)', padding: '0.5rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <FaSignOutAlt size={13} /> Cerrar sesion
                </button>
              </div>
            </div>

            {/* Favoritos */}
            <div className="account-card">
              <div className="account-card-header">
                <FaHeart size={13} style={{ color: '#E53935' }} /> Favoritos ({wishlist.length})
              </div>
              <div className="account-card-body">
                {wishlist.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--ts-text-muted)' }}>
                    <FaHeart size={28} style={{ opacity: 0.2, marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>No tenes productos favoritos</p>
                  </div>
                ) : (
                  <div className="wishlist-grid">
                    {wishlist.map(p => (
                      <div key={p.id} className="wishlist-item-mini">
                        <LinkContainer to={`/producto/${p.id}`}>
                          <div style={{ cursor: 'pointer' }}>
                            <img src={p.imagen} alt={p.nombre} style={{ width: '100%', height: 80, objectFit: 'contain', background: '#fafafa', padding: '0.25rem' }} />
                            <div style={{ padding: '0.4rem 0.5rem' }}>
                              <div style={{ color: 'var(--ts-text-mid)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.nombre}</div>
                              <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{formatPrice(p.precio)}</div>
                            </div>
                          </div>
                        </LinkContainer>
                        <button
                          onClick={() => toggleWishlist(p)}
                          style={{ width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--ts-border-light)', color: 'var(--ts-text-muted)', cursor: 'pointer', padding: '0.3rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                        >
                          <FaTrash size={10} /> Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserDashboard;
