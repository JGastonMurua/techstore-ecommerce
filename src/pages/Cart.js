import React, { useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCreditCard, FaLock, FaTruck, FaUndo } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { toast } from 'react-toastify';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart();

  const { loadProducts } = useProducts();
  const [processingPayment, setProcessingPayment] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 50000 ? 0 : 5000;
  const finalTotal = totalPrice + shippingCost;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleProceedToPayment = async () => {
    if (cartItems.length === 0) {
      toast.error('El carrito esta vacio');
      return;
    }

    setProcessingPayment(true);

    try {
      const stockErrors = [];
      for (const item of cartItems) {
        if (item.quantity > (item.stock || 0)) {
          stockErrors.push(`${item.nombre} - Stock insuficiente`);
        }
      }

      if (stockErrors.length > 0) {
        toast.error(`Stock insuficiente: ${stockErrors.join(', ')}`);
        setProcessingPayment(false);
        return;
      }

      const { productAPI } = await import('../services/api');

      for (const item of cartItems) {
        try {
          const productResponse = await productAPI.getById(item.id);
          const currentProduct = productResponse.data;
          const currentStock = Number(currentProduct.stock) || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          await productAPI.update(item.id, { ...currentProduct, stock: newStock });
        } catch (error) {
          console.error(`Error actualizando ${item.nombre}:`, error);
        }
      }

      clearCart();
      await loadProducts();
      toast.success('Redirigiendo a MercadoPago...');

      setTimeout(() => {
        window.location.href = 'https://www.mercadopago.com.ar/';
      }, 1000);

    } catch (error) {
      console.error('Error procesando pago:', error);
      toast.error('Error al procesar el pago. Intentalo de nuevo.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Carrito vacio
  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <div className="cart-empty">
          <FaShoppingBag size={64} className="mb-3" style={{ color: '#E0D4F0' }} />
          <h4 className="mb-2">Tu carrito esta vacio</h4>
          <p className="mb-4" style={{ color: '#666' }}>
            Agrega productos para comenzar tu compra
          </p>
          <LinkContainer to="/productos">
            <Button style={{ backgroundColor: 'var(--ts-purple)', border: 'none', fontWeight: 600 }}>
              <FaShoppingBag className="me-2" />
              Ver productos
            </Button>
          </LinkContainer>
        </div>
      </Container>
    );
  }

  return (
    <div className="cart-page">
      <Container>

        {/* Titulo y volver */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <LinkContainer to="/productos">
            <Button variant="link" className="p-0 text-decoration-none" style={{ color: 'var(--ts-purple)' }}>
              <FaArrowLeft className="me-1" size={13} />
              Seguir comprando
            </Button>
          </LinkContainer>
        </div>

        <h1 className="cart-title">
          Carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
        </h1>

        <Row className="g-3">

          {/* Columna izquierda - lista de items */}
          <Col lg={8}>
            <div className="cart-items-card">

              {/* Header */}
              <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ borderBottom: '1px solid var(--ts-border)' }}>
                <span style={{ fontWeight: 600, color: 'var(--ts-text)' }}>
                  Productos
                </span>
                <button
                  onClick={clearCart}
                  style={{ background: 'none', border: 'none', color: 'var(--ts-text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <FaTrash className="me-1" size={12} />
                  Vaciar carrito
                </button>
              </div>

              {/* Items */}
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">

                  {/* Imagen */}
                  <img
                    src={item.imagen || 'https://via.placeholder.com/80x80?text=Sin+Imagen'}
                    alt={item.nombre}
                    className="cart-item-image"
                  />

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.nombre}</div>
                    {item.marca && (
                      <small style={{ color: 'var(--ts-text-muted)' }}>{item.marca}</small>
                    )}

                    {/* Controles de cantidad */}
                    <div className="cart-item-actions">
                      <button
                        className="cart-qty-btn"
                        onClick={() => item.quantity <= 1 ? removeFromCart(item.id) : decrementQuantity(item.id)}
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="cart-qty-number">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => incrementQuantity(item.id)}
                      >
                        <FaPlus size={10} />
                      </button>
                      <button
                        className="cart-item-delete"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash size={11} className="me-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="cart-item-price">
                    {formatPrice(item.precio * item.quantity)}
                    {item.quantity > 1 && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--ts-text-muted)', fontWeight: 400 }}>
                        {formatPrice(item.precio)} c/u
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </Col>

          {/* Columna derecha - resumen */}
          <Col lg={4}>
            <div className="cart-summary-card">

              <div className="cart-summary-title">Resumen de compra</div>

              <div className="cart-summary-row">
                <span>Productos ({totalItems})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="cart-summary-row">
                <span>Envio</span>
                {shippingCost === 0 ? (
                  <span className="cart-summary-shipping">Gratis</span>
                ) : (
                  <span>{formatPrice(shippingCost)}</span>
                )}
              </div>

              {/* Progreso hacia envio gratis */}
              <div className="shipping-progress">
                {shippingCost === 0 ? (
                  <div style={{ color: 'var(--ts-success)', fontWeight: 600, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaTruck size={12} /> ¡Tenes envio gratis!
                  </div>
                ) : (
                  <>
                    <div style={{ color: 'var(--ts-text-muted)' }}>
                      Te faltan <strong style={{ color: 'var(--ts-text)' }}>{formatPrice(50000 - totalPrice)}</strong> para envio gratis
                    </div>
                    <div className="shipping-progress-bar-track">
                      <div
                        className="shipping-progress-bar-fill"
                        style={{ width: `${Math.min(100, (totalPrice / 50000) * 100)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="cart-summary-row total">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              <button
                className="btn-checkout"
                onClick={handleProceedToPayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="me-2" />
                    Continuar compra
                  </>
                )}
              </button>

              {/* Garantias */}
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--ts-border)' }}>
                <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.82rem', color: 'var(--ts-text-muted)' }}>
                  <FaLock size={12} style={{ color: 'var(--ts-success)' }} />
                  Compra 100% segura
                </div>
                <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.82rem', color: 'var(--ts-text-muted)' }}>
                  <FaTruck size={12} style={{ color: 'var(--ts-success)' }} />
                  Envio en 24-48hs
                </div>
                <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem', color: 'var(--ts-text-muted)' }}>
                  <FaUndo size={12} style={{ color: 'var(--ts-success)' }} />
                  30 dias para devoluciones
                </div>
              </div>

            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
}

export default Cart;
