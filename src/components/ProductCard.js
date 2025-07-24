import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    const currentQuantity = getItemQuantity(product.id);
    const availableStock = product.stock || 0;
    
    if (currentQuantity >= availableStock) {
      // No se puede agregar más productos
      return;
    }
    
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const currentQuantity = getItemQuantity(product.id);
  const availableStock = product.stock || 0;
  const canAddMore = currentQuantity < availableStock;

  return (
    <Card className="product-card h-100 shadow-sm">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={product.imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen'} 
          alt={product.nombre}
          className="product-image"
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {availableStock <= 5 && availableStock > 0 && (
          <Badge 
            bg="warning" 
            className="position-absolute top-0 end-0 m-2"
          >
            Últimas unidades
          </Badge>
        )}
        {availableStock === 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 end-0 m-2"
          >
            Sin stock
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          <Card.Title className="h6 mb-2">{product.nombre}</Card.Title>
          <Card.Text className="text-muted small mb-2">
            {product.categoria && (
              <Badge bg="secondary" className="me-2">
                {product.categoria}
              </Badge>
            )}
            {product.marca && (
              <span className="fw-bold">{product.marca}</span>
            )}
          </Card.Text>
          <Card.Text className="small text-truncate" style={{ maxHeight: '3rem' }}>
            {product.descripcion}
          </Card.Text>
        </div>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="h5 mb-0 text-primary fw-bold">
              {formatPrice(product.precio)}
            </span>
            {product.puntuacion && (
              <small className="text-muted">
                ⭐ {product.puntuacion}/5
              </small>
            )}
          </div>
          
          <div className="d-grid gap-2">
            <Button
              variant={
                availableStock === 0 
                  ? "secondary" 
                  : !canAddMore 
                    ? "warning" 
                    : isInCart(product.id) 
                      ? "success" 
                      : "primary"
              }
              size="sm"
              onClick={handleAddToCart}
              disabled={availableStock === 0 || !canAddMore}
            >
              <FaShoppingCart className="me-1" />
              {availableStock === 0 
                ? 'Sin Stock'
                : !canAddMore 
                  ? 'Stock Máximo'
                  : isInCart(product.id) 
                    ? 'Agregar Más' 
                    : 'Agregar'
              }
            </Button>
          </div>
          
          <div className="mt-1 text-center">
            <small className="text-muted d-block">
              Stock: {availableStock} unidades
            </small>
            {currentQuantity > 0 && (
              <small className="text-primary">
                En carrito: {currentQuantity}
              </small>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;