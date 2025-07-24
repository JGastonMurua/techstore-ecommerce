import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Image } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCog } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useProducts } from '../context/ProductContext';
import ProductForm from '../components/ProductForm';
import ConfirmModal from '../components/ConfirmModal';
import Loading from '../components/Loading';

function Admin() {
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

  // Estados para los modales
  const [showProductForm, setShowProductForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Manejar agregar producto
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  // Manejar editar producto
  const handleEditProduct = (product) => {
    console.log('Editando producto:', product); // Debug
    console.log('ID del producto:', product.id); // Debug
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  // Manejar eliminar producto
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowConfirmModal(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (productToDelete) {
      setFormLoading(true);
      try {
        await deleteProduct(productToDelete.id);
        setShowConfirmModal(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Error al eliminar:', error);
      } finally {
        setFormLoading(false);
      }
    }
  };

  // Manejar envío del formulario
  const handleSubmitProduct = async (productData) => {
    setFormLoading(true);
    try {
      if (selectedProduct) {
        // Actualizar producto existente
        await updateProduct(selectedProduct.id, productData);
      } else {
        // Crear nuevo producto
        await addProduct(productData);
      }
      setShowProductForm(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Obtener badge de stock
  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge bg="danger">Sin stock</Badge>;
    if (stock <= 5) return <Badge bg="warning">Poco stock</Badge>;
    return <Badge bg="success">En stock</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Panel de Administración - TechStore</title>
        <meta name="description" content="Panel de administración para gestionar productos de TechStore" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col>
              <h1 className="display-6 fw-bold mb-1">
                <FaCog className="me-2" />
                Panel de Administración
              </h1>
              <p className="mb-0 opacity-75">
                Gestiona el catálogo de productos
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Header con estadísticas */}
        <Row className="mb-4">
          <Col md={8}>
            <Card>
              <Card.Body>
                <Row className="text-center">
                  <Col>
                    <h3 className="text-primary mb-1">{products.length}</h3>
                    <small className="text-muted">Productos Total</small>
                  </Col>
                  <Col>
                    <h3 className="text-success mb-1">
                      {products.filter(p => p.stock > 0).length}
                    </h3>
                    <small className="text-muted">En Stock</small>
                  </Col>
                  <Col>
                    <h3 className="text-warning mb-1">
                      {products.filter(p => p.stock <= 5 && p.stock > 0).length}
                    </h3>
                    <small className="text-muted">Poco Stock</small>
                  </Col>
                  <Col>
                    <h3 className="text-danger mb-1">
                      {products.filter(p => p.stock === 0).length}
                    </h3>
                    <small className="text-muted">Sin Stock</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <div className="d-grid">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleAddProduct}
                className="h-100"
              >
                <FaPlus className="me-2" />
                Agregar Producto
              </Button>
            </div>
          </Col>
        </Row>

        {/* Mostrar error si existe */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>Error</Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        {/* Tabla de productos */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">Listado de Productos</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <Loading message="Cargando productos..." />
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}>
                  📦
                </div>
                <h5 className="text-muted">No hay productos registrados</h5>
                <p className="text-muted">Comienza agregando tu primer producto</p>
                <Button variant="primary" onClick={handleAddProduct}>
                  <FaPlus className="me-2" />
                  Agregar Primer Producto
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Image
                              src={product.imagen || 'https://via.placeholder.com/50x50?text=Sin+Imagen'}
                              alt={product.nombre}
                              rounded
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              className="me-3"
                            />
                            <div>
                              <div className="fw-bold">{product.nombre}</div>
                              <small className="text-muted">
                                {product.marca && `${product.marca} • `}
                                ID: {product.id}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary">
                            {product.categoria || 'Sin categoría'}
                          </Badge>
                        </td>
                        <td className="fw-bold text-primary">
                          {formatPrice(product.precio)}
                        </td>
                        <td>
                          <div>
                            <span className="fw-bold">{product.stock || 0}</span>
                            <div>{getStockBadge(product.stock || 0)}</div>
                          </div>
                        </td>
                        <td>
                          <Badge bg={product.disponible !== false ? "success" : "secondary"}>
                            {product.disponible !== false ? "Disponible" : "No disponible"}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              title="Editar producto"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                              title="Eliminar producto"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal para agregar/editar producto */}
      <ProductForm
        show={showProductForm}
        onHide={() => {
          setShowProductForm(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmitProduct}
        product={selectedProduct}
        loading={formLoading}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => {
          setShowConfirmModal(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={
          productToDelete
            ? `¿Estás seguro de que quieres eliminar "${productToDelete.nombre}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={formLoading}
      />
    </>
  );
}

export default Admin;