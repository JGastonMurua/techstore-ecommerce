import React, { useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import CustomPagination from '../components/Pagination';
import Loading, { NoProducts, ProductSkeleton } from '../components/Loading';

function Products() {
  const {
    loading,
    error,
    getPaginatedProducts,
    getTotalPages,
    getFilteredProducts,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setCurrentPage
  } = useProducts();

  const [searchParams] = useSearchParams();

  // Leer ?q= de la URL y aplicarlo al buscador (o limpiarlo si no hay query)
  useEffect(() => {
    const q = searchParams.get('q');
    setSearchTerm(q || '');
    setCurrentPage(1);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const paginatedProducts = getPaginatedProducts();
  const totalPages = getTotalPages();
  const totalFilteredProducts = getFilteredProducts().length;

  const getPageTitle = () => {
    if (searchTerm && selectedCategory !== 'all') return `${searchTerm} en ${selectedCategory} - TechStore`;
    if (searchTerm) return `${searchTerm} - TechStore`;
    if (selectedCategory !== 'all') return `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} - TechStore`;
    return 'Productos - TechStore';
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta
          name="description"
          content={`Descubre nuestra seleccion de productos tecnologicos. ${totalFilteredProducts} productos disponibles.`}
        />
      </Helmet>

      {/* Header */}
      <div style={{ background: 'var(--ts-bg-white)', borderBottom: '1px solid var(--ts-border-light)', padding: '0.85rem 0' }}>
        <Container>
          <h1 style={{ color: 'var(--ts-text)', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>
            {selectedCategory !== 'all'
              ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
              : 'Todos los productos'}
            {totalFilteredProducts > 0 && !loading && (
              <span style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--ts-text-muted)', marginLeft: '0.5rem' }}>
                ({totalFilteredProducts} resultado{totalFilteredProducts !== 1 ? 's' : ''})
              </span>
            )}
          </h1>
        </Container>
      </div>

      <Container className="py-4">
        {/* Barra de busqueda */}
        <Row className="mb-4">
          <Col>
            <SearchBar />
          </Col>
        </Row>

        {/* Error */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <strong>Error al cargar productos</strong>
            <p className="mb-0 mt-1">{error}</p>
          </Alert>
        )}

        {/* Filtros activos */}
        {!loading && !error && (searchTerm || selectedCategory !== 'all') && (
          <div className="mb-3" style={{ fontSize: '0.88rem', color: 'var(--ts-text-muted)' }}>
            {searchTerm && <span>Busqueda: <strong>"{searchTerm}"</strong></span>}
            {searchTerm && selectedCategory !== 'all' && <span className="mx-2">·</span>}
            {selectedCategory !== 'all' && <span>Categoria: <strong>{selectedCategory}</strong></span>}
          </div>
        )}

        {/* Productos */}
        {loading ? (
          <Row className="g-3">
            {[...Array(8)].map((_, i) => (
              <Col md={6} lg={3} key={i}>
                <ProductSkeleton />
              </Col>
            ))}
          </Row>
        ) : error ? null : paginatedProducts.length === 0 ? (
          <NoProducts
            message={
              searchTerm || selectedCategory !== 'all'
                ? 'No se encontraron productos con los filtros aplicados'
                : 'No hay productos disponibles en este momento'
            }
          />
        ) : (
          <>
            <Row className="g-3">
              {paginatedProducts.map(product => (
                <Col md={6} lg={3} key={product.id} className="fade-in">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <Row className="mt-4">
                <Col>
                  <CustomPagination />
                </Col>
              </Row>
            )}
          </>
        )}

        {/* Pie de pagina */}
        {!loading && !error && paginatedProducts.length > 0 && (
          <div className="text-center mt-5 pt-4" style={{ borderTop: '1px solid var(--ts-border)', color: 'var(--ts-text-muted)', fontSize: '0.88rem' }}>
            No encontras lo que buscas? Contactanos y te ayudamos.
          </div>
        )}
      </Container>
    </>
  );
}

export default Products;
