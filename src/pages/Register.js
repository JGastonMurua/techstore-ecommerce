import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register({
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password
    });
    
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <Helmet>
        <title>Registrarse - TechStore</title>
        <meta name="description" content="Crea tu cuenta en TechStore y disfruta de la mejor experiencia de compra." />
      </Helmet>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-success text-white text-center py-4">
                <FaUserPlus size={50} className="mb-3" />
                <h3 className="mb-0">Crear Cuenta</h3>
                <p className="mb-0 opacity-75">Únete a la familia TechStore</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  {/* Nombre */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <div className="position-relative">
                      <FaUser className="position-absolute" 
                        style={{ left: '12px', top: '12px', color: '#6c757d' }} />
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        className="ps-5"
                        isInvalid={!!errors.name}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* Apellido */}
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <div className="position-relative">
                      <FaUser className="position-absolute" 
                        style={{ left: '12px', top: '12px', color: '#6c757d' }} />
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                        className="ps-5"
                        isInvalid={!!errors.lastName}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="position-relative">
                      <FaEnvelope className="position-absolute" 
                        style={{ left: '12px', top: '12px', color: '#6c757d' }} />
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className="ps-5"
                        isInvalid={!!errors.email}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* Contraseña */}
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <div className="position-relative">
                      <FaLock className="position-absolute" 
                        style={{ left: '12px', top: '12px', color: '#6c757d' }} />
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        className="ps-5 pe-5"
                        isInvalid={!!errors.password}
                        disabled={loading}
                      />
                      <Button
                        variant="link"
                        className="position-absolute border-0 p-0"
                        style={{ right: '12px', top: '8px', color: '#6c757d' }}
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* Confirmar contraseña */}
                  <Form.Group className="mb-4">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <div className="position-relative">
                      <FaLock className="position-absolute" 
                        style={{ left: '12px', top: '12px', color: '#6c757d' }} />
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirma tu contraseña"
                        className="ps-5 pe-5"
                        isInvalid={!!errors.confirmPassword}
                        disabled={loading}
                      />
                      <Button
                        variant="link"
                        className="position-absolute border-0 p-0"
                        style={{ right: '12px', top: '8px', color: '#6c757d' }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* Botón de registro */}
                  <div className="d-grid mb-3">
                    <Button
                      variant="success"
                      type="submit"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="me-2" />
                          Crear Cuenta
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Link de login */}
                  <div className="text-center">
                    <small className="text-muted">
                      ¿Ya tienes cuenta?{' '}
                      <Link to="/login" className="text-decoration-none">
                        Inicia sesión aquí
                      </Link>
                    </small>
                  </div>
                </Form>

                {/* Información adicional */}
                <div className="border-top pt-3 mt-4">
                  <Alert variant="info" className="mb-0">
                    <small>
                      <strong>Nota:</strong> Esta es una aplicación de demostración. 
                      Los datos no se almacenan de forma permanente.
                    </small>
                  </Alert>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Register;