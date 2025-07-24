import React, { useState } from 'react';
import { Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useProducts } from '../context/ProductContext';

function SearchBar() {
  const { 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory, 
    getCategories,
    setCurrentPage 
  } = useProducts();
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const categories = getCategories();

  // Manejar búsqueda en tiempo real
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a página 1 cuando se busca
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Resetear a página 1 cuando se cambia categoría
  };

  return (
    <div className="search-bar mb-4">
      <Row className="g-3">
        {/* Barra de búsqueda principal */}
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar productos, marcas, categorías..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              aria-label="Buscar productos"
            />
            {(localSearchTerm || selectedCategory !== 'all') && (
              <Button
                variant="outline-secondary"
                onClick={clearSearch}
                title="Limpiar búsqueda"
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Col>

        {/* Filtro por categoría */}
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Filtrar por categoría"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Indicador de filtros activos */}
      {(searchTerm || selectedCategory !== 'all') && (
        <Row className="mt-2">
          <Col>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <small className="text-muted">Filtros activos:</small>
              
              {searchTerm && (
                <span className="badge bg-primary">
                  Búsqueda: "{searchTerm}"
                </span>
              )}
              
              {selectedCategory !== 'all' && (
                <span className="badge bg-secondary">
                  Categoría: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </span>
              )}
              
              <Button
                variant="link"
                size="sm"
                onClick={clearSearch}
                className="text-decoration-none p-0 ms-2"
              >
                Limpiar filtros
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default SearchBar;