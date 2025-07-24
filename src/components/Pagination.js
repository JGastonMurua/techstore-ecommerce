import React from 'react';
import { Pagination, Row, Col } from 'react-bootstrap';
import { useProducts } from '../context/ProductContext';

function CustomPagination() {
  const { 
    currentPage, 
    setCurrentPage, 
    getTotalPages, 
    getFilteredProducts,
    productsPerPage 
  } = useProducts();

  const totalPages = getTotalPages();
  const totalProducts = getFilteredProducts().length;
  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  // No mostrar paginación si hay una página o menos
  if (totalPages <= 1) {
    return null;
  }

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar un rango
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Ajustar el inicio si estamos cerca del final
      const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);
      
      for (let i = adjustedStartPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll suave hacia arriba
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-4">
      <Row className="align-items-center">
        <Col md={6}>
          <div className="d-flex justify-content-center justify-content-md-start">
            <Pagination className="mb-0">
              {/* Botón Primera página */}
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              
              {/* Botón Anterior */}
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {/* Mostrar "..." si la primera página no está visible */}
              {pageNumbers[0] > 1 && (
                <>
                  <Pagination.Item onClick={() => handlePageChange(1)}>
                    1
                  </Pagination.Item>
                  {pageNumbers[0] > 2 && <Pagination.Ellipsis disabled />}
                </>
              )}

              {/* Números de página */}
              {pageNumbers.map(page => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              ))}

              {/* Mostrar "..." si la última página no está visible */}
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <Pagination.Ellipsis disabled />
                  )}
                  <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </Pagination.Item>
                </>
              )}

              {/* Botón Siguiente */}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              
              {/* Botón Última página */}
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="text-center text-md-end">
            <small className="text-muted">
              Mostrando {startProduct} - {endProduct} de {totalProducts} productos
              {totalPages > 1 && (
                <span className="d-block d-md-inline ms-md-2">
                  (Página {currentPage} de {totalPages})
                </span>
              )}
            </small>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CustomPagination;