import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';

function ProductForm({ 
  show, 
  onHide, 
  onSubmit, 
  product = null, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagen: '',
    marca: '',
    stock: '',
    puntuacion: '',
    caracteristicas: '',
    disponible: true
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (show) {
      if (product) {
        console.log('Producto recibido para editar:', product); // Debug
        setFormData({
          nombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: product.precio || '',
          categoria: product.categoria || '',
          imagen: product.imagen || '',
          marca: product.marca || '',
          stock: product.stock || '',
          puntuacion: product.puntuacion || '',
          caracteristicas: product.caracteristicas || '',
          disponible: product.disponible !== false
        });
        setIsEditing(true);
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          categoria: '',
          imagen: '',
          marca: '',
          stock: '',
          puntuacion: '',
          caracteristicas: '',
          disponible: true
        });
        setIsEditing(false);
      }
      setErrors({});
    }
  }, [show, product]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Nombre obligatorio
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    // Precio mayor a 0
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    // Descripción mínima de 10 caracteres
    if (!formData.descripcion.trim() || formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    // Categoría obligatoria
    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es obligatoria';
    }

    // Imagen obligatoria
    if (!formData.imagen.trim()) {
      newErrors.imagen = 'La URL de la imagen es obligatoria';
    }

    // Stock debe ser número positivo
    if (formData.stock && parseFloat(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    // Puntuación entre 0 y 5
    if (formData.puntuacion && (parseFloat(formData.puntuacion) < 0 || parseFloat(formData.puntuacion) > 5)) {
      newErrors.puntuacion = 'La puntuación debe estar entre 0 y 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convertir a números los campos numéricos
    const processedData = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: formData.stock ? parseInt(formData.stock) : 0,
      puntuacion: formData.puntuacion ? parseFloat(formData.puntuacion) : 0
    };

    console.log('Datos procesados para enviar:', processedData); // Debug
    console.log('Es edición:', isEditing); // Debug

    onSubmit(processedData);
  };

  const categories = [
    'smartphones',
    'laptops', 
    'tablets',
    'accesorios',
    'audio',
    'gaming',
    'componentes'
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">
            {/* Nombre */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  isInvalid={!!errors.nombre}
                  placeholder="Ej: iPhone 14 Pro"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Marca */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  placeholder="Ej: Apple"
                />
              </Form.Group>
            </Col>

            {/* Descripción */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Descripción *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  isInvalid={!!errors.descripcion}
                  placeholder="Describe las características del producto (mínimo 10 caracteres)"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.descripcion}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Precio */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Precio *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  isInvalid={!!errors.precio}
                  placeholder="0.00"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.precio}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Stock */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  isInvalid={!!errors.stock}
                  placeholder="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stock}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Puntuación */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Puntuación</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="puntuacion"
                  value={formData.puntuacion}
                  onChange={handleChange}
                  isInvalid={!!errors.puntuacion}
                  placeholder="0.0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.puntuacion}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Categoría */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  isInvalid={!!errors.categoria}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.categoria}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Disponible */}
            <Col md={6}>
              <Form.Group className="d-flex align-items-center h-100">
                <Form.Check
                  type="checkbox"
                  name="disponible"
                  checked={formData.disponible}
                  onChange={handleChange}
                  label="Producto disponible"
                />
              </Form.Group>
            </Col>

            {/* URL de imagen */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>URL de Imagen *</Form.Label>
                <Form.Control
                  type="url"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleChange}
                  isInvalid={!!errors.imagen}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.imagen}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Proporciona una URL válida de imagen
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Características */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Características Adicionales</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="caracteristicas"
                  value={formData.caracteristicas}
                  onChange={handleChange}
                  placeholder="Características técnicas, especificaciones, etc."
                />
              </Form.Group>
            </Col>
          </Row>

          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="mt-3 mb-0">
              <small>Por favor corrige los errores antes de continuar.</small>
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            <FaTimes className="me-1" />
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FaSave className="me-1" />
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Producto')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ProductForm;