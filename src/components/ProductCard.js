import React from 'react';
import { FaShoppingCart, FaCheck, FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const getMockRating = (id) => {
  const hash = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return +(3.5 + (hash % 16) / 10).toFixed(1);
};
const getMockReviews = (id) => {
  const hash = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return 20 + (hash % 180);
};
const renderStars = (rating) => {
  const safe = Math.min(5, Math.max(0, isNaN(Number(rating)) ? 4 : Number(rating)));
  const full = Math.floor(safe);
  const half = safe % 1 >= 0.5;
  const empty = Math.max(0, 5 - full - (half ? 1 : 0));
  return [
    ...[...Array(full)].map((_, i) => <FaStar key={`f${i}`} />),
    ...(half ? [<FaStarHalfAlt key="h" />] : []),
    ...[...Array(empty)].map((_, i) => <FaRegStar key={`e${i}`} />),
  ];
};

function ProductCard({ product }) {
  const { addToCart, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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
  const inWishlist = isInWishlist(product.id);
  const rating = product.rating || getMockRating(product.id);
  const reviews = product.reviews || getMockReviews(product.id);

  return (
    <div className="product-card">

      {/* Imagen — clickeable al detalle */}
      <LinkContainer to={`/producto/${product.id}`}>
      <div className="position-relative" style={{ cursor: 'pointer' }}>
        <img
          src={product.imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
          alt={product.nombre}
          className="product-image w-100"
          loading="lazy"
        />
        <button
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          title={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <FaHeart size={13} />
        </button>
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

        {/* Rating */}
        <div className="star-rating">
          {renderStars(rating)}
          <span className="review-count">({reviews})</span>
        </div>

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
          <small style={{ color: 'var(--ts-purple)', fontWeight: 600, fontSize: '0.8rem' }}>
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
