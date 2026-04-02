import React from 'react';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    const currentQuantity = getItemQuantity(product.id);
    const availableStock = product.stock || 0;
    if (currentQuantity >= availableStock) return;
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const currentQuantity = getItemQuantity(product.id);
  const availableStock = product.stock || 0;
  const canAddMore = currentQuantity < availableStock;
  const outOfStock = availableStock === 0;

  return (
    <div className="product-card">

      {/* Imagen — clickeable al detalle */}
      <LinkContainer to={`/producto/${product.id}`}>
      <div className="position-relative" style={{ cursor: 'pointer' }}>
        <img
          src={product.imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
          alt={product.nombre}
          className="product-image w-100"
        />
        {availableStock <= 5 && availableStock > 0 && (
          <span
            className="badge-stock-low position-absolute"
            style={{ top: '8px', left: '8px' }}
          >
            Ultimas unidades
          </span>
        )}
        {outOfStock && (
          <span
            className="position-absolute"
            style={{
              top: '8px', left: '8px',
              background: '#E53935', color: 'white',
              fontSize: '0.75rem', padding: '0.25rem 0.5rem',
              borderRadius: '4px', fontWeight: 600
            }}
          >
            Sin stock
          </span>
        )}
      </div>
      </LinkContainer>

      {/* Cuerpo */}
      <div className="card-body d-flex flex-column" style={{ gap: '0.25rem' }}>

        {/* Marca */}
        {product.marca && (
          <small style={{ color: 'var(--ts-text-muted)', fontSize: '0.78rem' }}>
            {product.marca}
          </small>
        )}

        {/* Nombre */}
        <LinkContainer to={`/producto/${product.id}`}>
          <p className="product-name mb-1" style={{ cursor: 'pointer' }}>{product.nombre}</p>
        </LinkContainer>

        {/* Precio */}
        <div className="product-price">{formatPrice(product.precio)}</div>

        {/* Cuotas sin interes */}
        <div className="product-installments">
          3 cuotas sin interes de {formatPrice(product.precio / 3)}
        </div>

        {/* Envio */}
        {!outOfStock && (
          <div className="product-shipping">
            {product.precio > 50000 ? 'Envio gratis' : 'Envio desde $5.000'}
          </div>
        )}

        {/* Cantidad en carrito */}
        {currentQuantity > 0 && (
          <small style={{ color: 'var(--ts-primary)', fontWeight: 600, fontSize: '0.8rem' }}>
            <FaCheck size={10} className="me-1" />
            {currentQuantity} en tu carrito
          </small>
        )}

        {/* Boton agregar */}
        <button
          className="btn-add-cart mt-auto"
          onClick={handleAddToCart}
          disabled={outOfStock || !canAddMore}
          style={{
            opacity: outOfStock || !canAddMore ? 0.5 : 1,
            cursor: outOfStock || !canAddMore ? 'not-allowed' : 'pointer'
          }}
        >
          <FaShoppingCart className="me-2" size={13} />
          {outOfStock
            ? 'Sin stock'
            : !canAddMore
              ? 'Stock maximo'
              : 'Agregar al carrito'
          }
        </button>

      </div>
    </div>
  );
}

export default ProductCard;
