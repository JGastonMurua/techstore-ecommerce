import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Image, Alert, Badge, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Función para procesar el pago (VERSIÓN SIMPLE)
  const handleProceedToPayment = async () => {
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setProcessingPayment(true);

    try {
      // 1. Verificar stock antes del pago
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

      // 2. Descontar stock de la base de datos
      const { productAPI } = await import('../services/api');
      
      for (const item of cartItems) {
        try {
          // Obtener producto actual
          const productResponse = await productAPI.getById(item.id);
          const currentProduct = productResponse.data;
          
          // Calcular nuevo stock
          const currentStock = Number(currentProduct.stock) || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          
          // Actualizar stock en la base de datos
          await productAPI.update(item.id, {
            ...currentProduct,
            stock: newStock
          });
          
          console.log(`Stock actualizado: ${item.nombre} ${currentStock} -> ${newStock}`);
        } catch (error) {
          console.error(`Error actualizando ${item.nombre}:`, error);
        }
      }

      // 3. Limpiar carrito
      clearCart();
      
      // 4. Recargar productos para mostrar nuevo stock
      await loadProducts();
      
      // 5. Mostrar mensaje y redirigir a MercadoPago
      toast.success('Redirigiendo a MercadoPago...');
      
      // URL DIRECTA DE MERCADOPAGO 
      const mercadoPagoURL = 'https://www.mercadopago.com.ar/';
      
      
      // Redirigir después de 1 segundo
      setTimeout(() => {
        window.location.href = 'https://www.mercadopago.com.ar/';
      }, 1000);

    } catch (error) {
      console.error('Error procesando pago:', error);
      toast.error('Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="mb-4" style={{ fontSize: '5rem', opacity: 0.3 }}>
              🛒
            </div>
            <h2 className="mb-3">Tu carrito está vacío</h2>
            <p className="text-muted mb-4">
              ¡Agrega algunos productos increíbles a tu carrito!
            </p>
            <LinkContainer to="/productos">
              <Button variant="primary" size="lg">
                <FaShoppingBag className="me-2" />
                Explorar Productos
              </Button>
            </LinkContainer>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div>
      <div className="bg-light py-4">
        <Container>
          <Row>
            <Col>
              <h1 className="display-6 fw-bold mb-1">
                Carrito de Compras
              </h1>
              <p className="text-muted mb-0">
                Revisa y confirma tu pedido
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Row>
          {/* Botón volver */}
          <Col>
            <LinkContainer to="/productos">
              <Button variant="outline-secondary" className="mb-4">
                <FaArrowLeft className="me-2" />
                Seguir Comprando
              </Button>
            </LinkContainer>
          </Col>
        </Row>

        <Row>
          {/* Lista de productos */}
          <Col lg={8}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Productos ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </h5>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={clearCart}
                >
                  <FaTrash className="me-1" />
                  Vaciar Carrito
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item p-3">
                    <Row className="align-items-center">
                      {/* Imagen del producto */}
                      <Col xs={3} md={2}>
                        <Image
                          src={item.imagen || 'https://via.placeholder.com/100x100?text=Sin+Imagen'}
                          alt={item.nombre}
                          rounded
                          fluid
                          style={{ maxHeight: '80px', objectFit: 'cover' }}
                        />
                      </Col>

                      {/* Información del producto */}
                      <Col xs={9} md={4}>
                        <h6 className="mb-1">{item.nombre}</h6>
                        <small className="text-muted d-block">
                          {item.categoria && (
                            <Badge bg="secondary" className="me-2">
                              {item.categoria}
                            </Badge>
                          )}
                          {item.marca}
                        </small>
                        <div className="text-primary fw-bold">
                          {formatPrice(item.precio)}
                        </div>
                      </Col>

                      {/* Controles de cantidad */}
                      <Col xs={12} md={3} className="mt-2 mt-md-0">
                        <div className="d-flex align-items-center justify-content-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decrementQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </Button>
                          <span className="mx-3 fw-bold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => incrementQuantity(item.id)}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </Col>

                      {/* Subtotal y eliminar */}
                      <Col xs={12} md={3} className="text-center text-md-end mt-2 mt-md-0">
                        <div className="fw-bold text-primary mb-2">
                          {formatPrice(item.precio * item.quantity)}
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Resumen del pedido */}
          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header>
                <h5 className="mb-0">Resumen del Pedido</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'}):</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <span className="text-success">
                    {totalPrice > 50000 ? 'GRATIS' : formatPrice(5000)}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary">
                    {formatPrice(totalPrice > 50000 ? totalPrice : totalPrice + 5000)}
                  </strong>
                </div>

                {totalPrice <= 50000 && (
                  <Alert variant="info" className="small mb-3">
                    💡 Agrega {formatPrice(50000 - totalPrice)} más para envío gratuito
                  </Alert>
                )}

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleProceedToPayment}
                    disabled={processingPayment || totalItems === 0}
                  >
                    {processingPayment ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="me-2" />
                        Proceder al Pago
                      </>
                    )}
                  </Button>
                  <LinkContainer to="/productos">
                    <Button variant="outline-secondary" disabled={processingPayment}>
                      Continuar Comprando
                    </Button>
                  </LinkContainer>
                </div>

                {/* Información adicional */}
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    🔒 Compra 100% segura<br />
                    📦 Envío en 24-48hs<br />
                    🔄 30 días para devoluciones
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Cart;