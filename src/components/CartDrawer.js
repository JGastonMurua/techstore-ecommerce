import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTimes, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { CONFIG } from '../config/cliente';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);

function CartDrawer() {
  const {
    cartItems, isCartOpen, closeCart,
    incrementQuantity, decrementQuantity, removeFromCart,
    getTotalPrice, getTotalItems,
  } = useCart();

  const { products } = useProducts();

  // Stock actualizado desde la base de datos
  const getLiveStock = (productId) => {
    const p = products.find(p => p.id === productId);
    return p?.stock ?? 999;
  };

  const total    = getTotalPrice();
  const shipping = total >= CONFIG.envioGratisDesde ? 0 : CONFIG.costoEnvio;
  const totalItems = getTotalItems();

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 1040,
          opacity: isCartOpen ? 1 : 0,
          pointerEvents: isCartOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* ── Drawer panel ── */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        height: '100dvh', width: '100%', maxWidth: 400,
        background: '#fff',
        zIndex: 1050,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-6px 0 32px rgba(0,0,0,0.18)',
        transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e9ecef',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaShoppingBag size={18} style={{ color: 'var(--ts-purple)' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Mi carrito</span>
            {totalItems > 0 && (
              <Badge pill bg="primary" style={{ fontSize: '0.72rem' }}>{totalItems}</Badge>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#555', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#f5f5f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <FaShoppingBag size={32} style={{ opacity: 0.2 }} />
              </div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Tu carrito está vacío</p>
              <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '1.25rem' }}>
                Agregá productos para comenzar
              </p>
              <LinkContainer to="/productos">
                <Button variant="outline-primary" size="sm" className="rounded-pill px-4" onClick={closeCart}>
                  Ver productos
                </Button>
              </LinkContainer>
            </div>
          ) : (
            cartItems.map(item => {
              const stock = getLiveStock(item.id);
              const atMax = item.quantity >= stock;
              return (
                <div key={item.id} style={{
                  display: 'flex', gap: '0.75rem',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid #f3f3f3',
                  alignItems: 'flex-start',
                }}>
                  {/* Imagen */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={item.imagen || 'https://via.placeholder.com/64'}
                      alt={item.nombre}
                      style={{
                        width: 64, height: 64, objectFit: 'contain',
                        borderRadius: 8, background: '#fafafa',
                        border: '1px solid #eee',
                      }}
                    />
                    {stock <= 5 && stock > 0 && (
                      <span style={{
                        position: 'absolute', bottom: -6, left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#e53935', color: 'white',
                        fontSize: '0.62rem', fontWeight: 700,
                        padding: '1px 5px', borderRadius: 10,
                        whiteSpace: 'nowrap',
                      }}>
                        Quedan {stock}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: '0 0 3px',
                      fontSize: '0.83rem', fontWeight: 500,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      color: '#222',
                    }}>{item.nombre}</p>
                    <p style={{
                      margin: '0 0 10px',
                      fontSize: '1rem', fontWeight: 700,
                      color: '#3483fa',
                    }}>{formatPrice(item.precio * item.quantity)}</p>

                    {/* Controles cantidad + eliminar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Stepper */}
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        border: '1px solid #ddd', borderRadius: 20,
                        overflow: 'hidden', height: 32,
                      }}>
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          aria-label="Reducir cantidad"
                          style={{
                            width: 32, height: 32, border: 'none',
                            background: 'none', cursor: 'pointer',
                            fontSize: '1.2rem', fontWeight: 300,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#444',
                          }}
                        >−</button>
                        <span style={{
                          minWidth: 28, textAlign: 'center',
                          fontSize: '0.9rem', fontWeight: 700, color: '#222',
                        }}>{item.quantity}</span>
                        <button
                          onClick={() => !atMax && incrementQuantity(item.id)}
                          disabled={atMax}
                          aria-label="Aumentar cantidad"
                          title={atMax ? `Máximo disponible: ${stock}` : ''}
                          style={{
                            width: 32, height: 32, border: 'none',
                            background: 'none',
                            cursor: atMax ? 'not-allowed' : 'pointer',
                            fontSize: '1.2rem', fontWeight: 300,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: atMax ? '#ccc' : '#444',
                          }}
                        >+</button>
                      </div>

                      {atMax && (
                        <small style={{ color: '#e53935', fontSize: '0.72rem', fontWeight: 500 }}>
                          Máx. {stock}
                        </small>
                      )}

                      {/* Eliminar */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Eliminar producto"
                        style={{
                          marginLeft: 'auto', background: 'none', border: 'none',
                          cursor: 'pointer', color: '#bbb', padding: 4,
                          borderRadius: 4, transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#e53935'}
                        onMouseLeave={e => e.currentTarget.style.color = '#bbb'}
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer con totales y CTAs */}
        {cartItems.length > 0 && (
          <div style={{
            borderTop: '1px solid #e9ecef',
            padding: '1rem 1.25rem',
            background: '#fafafa',
            flexShrink: 0,
          }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem', color: '#666' }}>
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
              <span>{formatPrice(total)}</span>
            </div>

            {/* Envío */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem' }}>
              <span style={{ color: '#666' }}>Envío</span>
              {shipping === 0
                ? <span style={{ color: '#00a650', fontWeight: 600 }}>GRATIS</span>
                : <span>{formatPrice(shipping)}</span>
              }
            </div>

            {/* Barra envío gratis */}
            {shipping > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 4, borderRadius: 4, background: '#eee', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    background: '#00a650',
                    width: `${Math.min(100, (total / CONFIG.envioGratisDesde) * 100)}%`,
                    transition: 'width 0.4s',
                  }} />
                </div>
                <small style={{ color: '#666', fontSize: '0.75rem' }}>
                  Agregá {formatPrice(CONFIG.envioGratisDesde - total)} más para envío gratis
                </small>
              </div>
            )}

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '1rem',
              fontWeight: 700, fontSize: '1.05rem',
            }}>
              <span>Total</span>
              <span>{formatPrice(total + shipping)}</span>
            </div>

            {/* CTAs */}
            <LinkContainer to="/checkout">
              <Button
                variant="primary"
                className="w-100 rounded-pill fw-bold mb-2"
                onClick={closeCart}
              >
                Finalizar compra ({totalItems})
              </Button>
            </LinkContainer>
            <LinkContainer to="/carrito">
              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100 rounded-pill"
                onClick={closeCart}
              >
                Ver carrito completo
              </Button>
            </LinkContainer>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
