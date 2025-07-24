import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
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
    selectedCategory
  } = useProducts();

  const paginatedProducts = getPaginatedProducts();
  const totalPages = getTotalPages();
  const totalFilteredProducts = getFilteredProducts().length;

  // Determinar el título de la página
  const getPageTitle = () => {
    if (searchTerm && selectedCategory !== 'all') {
      return `Productos - ${searchTerm} en ${selectedCategory}`;
    } else if (searchTerm) {
      return `Productos - ${searchTerm}`;
    } else if (selectedCategory !== 'all') {
      return `Productos - ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`;
    }
    return 'Productos - TechStore';
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta 
          name="description" 
          content={`Descubre nuestra amplia selección de productos tecnológicos. ${totalFilteredProducts} productos disponibles.`}
        />
        <meta name="keywords" content="productos, tecnología, laptops, smartphones, tablets, comprar online" />
      </Helmet>

      <div className="bg-light py-4">
        <Container>
          <Row>
            <Col>
              <h1 className="display-6 fw-bold mb-1">
                Nuestros Productos
              </h1>
              <p className="text-muted mb-0">
                Encuentra la tecnología que necesitas
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Barra de búsqueda */}
        <Row>
          <Col>
            <SearchBar />
          </Col>
        </Row>

        {/* Mostrar error si existe */}
        {error && (
          <Row>
            <Col>
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>¡Oops! Algo salió mal</Alert.Heading>
                <p className="mb-0">{error}</p>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Información de resultados */}
        {!loading && !error && (
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-1">
                    {totalFilteredProducts === 0 
                      ? 'No se encontraron productos'
                      : `${totalFilteredProducts} producto${totalFilteredProducts !== 1 ? 's' : ''} encontrado${totalFilteredProducts !== 1 ? 's' : ''}`
                    }
                  </h5>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <small className="text-muted">
                      {searchTerm && `Búsqueda: "${searchTerm}"`}
                      {searchTerm && selectedCategory !== 'all' && ' • '}
                      {selectedCategory !== 'all' && `Categoría: ${selectedCategory}`}
                    </small>
                  )}
                </div>
                
                {totalPages > 1 && (
                  <small className="text-muted">
                    {totalPages} página{totalPages !== 1 ? 's' : ''} disponible{totalPages !== 1 ? 's' : ''}
                  </small>
                )}
              </div>
            </Col>
          </Row>
        )}

        {/* Contenido principal */}
        {loading ? (
          // Estado de carga
          <Row className="g-4">
            {[...Array(8)].map((_, index) => (
              <Col md={6} lg={3} key={index}>
                <ProductSkeleton />
              </Col>
            ))}
          </Row>
        ) : error ? (
          // Estado de error (ya mostrado arriba)
          null
        ) : paginatedProducts.length === 0 ? (
          // No hay productos
          <NoProducts 
            message={
              searchTerm || selectedCategory !== 'all' 
                ? "No se encontraron productos con los filtros aplicados"
                : "No hay productos disponibles en este momento"
            }
          />
        ) : (
          // Mostrar productos
          <>
            <Row className="g-4">
              {paginatedProducts.map(product => (
                <Col md={6} lg={3} key={product.id} className="fade-in">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <Row>
                <Col>
                  <CustomPagination />
                </Col>
              </Row>
            )}
          </>
        )}

        {/* Información adicional */}
        {!loading && !error && paginatedProducts.length > 0 && (
          <Row className="mt-5">
            <Col className="text-center">
              <div className="border-top pt-4">
                <p className="text-muted mb-2">
                  ¿No encuentras lo que buscas?
                </p>
                <p className="small text-muted">
                  Contáctanos y te ayudamos a encontrar el producto perfecto para ti
                </p>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default Products;