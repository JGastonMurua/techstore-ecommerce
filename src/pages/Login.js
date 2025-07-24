import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth, DemoUsers } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta a la que se debe redirigir después del login
  const from = location.state?.from?.pathname || '/';

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

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
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

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  // Función para autocompletar con usuario demo
  const fillDemoUser = (email, password) => {
    setFormData({ email, password });
    setErrors({});
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - TechStore</title>
        <meta name="description" content="Inicia sesión en TechStore para acceder a tu cuenta y realizar compras." />
      </Helmet>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white text-center py-4">
                <FaSignInAlt size={50} className="mb-3" />
                <h3 className="mb-0">Iniciar Sesión</h3>
                <p className="mb-0 opacity-75">Bienvenido de vuelta</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
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
                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <div className="position-relative">
                      <FaLock className="position-absolute" 
                        style={{ left: '12px', top: '12px', color: '#6c757d' }} />
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Tu contraseña"
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

                  {/* Botón de login */}
                  <div className="d-grid mb-3">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Iniciando sesión...
                        </>
                      ) : (
                        <>
                          <FaSignInAlt className="me-2" />
                          Iniciar Sesión
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Links */}
                  <div className="text-center">
                    <small className="text-muted">
                      ¿No tienes cuenta?{' '}
                      <Link to="/register" className="text-decoration-none">
                        Regístrate aquí
                      </Link>
                    </small>
                  </div>
                </Form>

                {/* Usuarios demo */}
                <div className="border-top pt-3 mt-4">
                  <Alert variant="info">
                    <Alert.Heading className="h6">Usuarios de prueba</Alert.Heading>
                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => fillDemoUser('admin@techstore.com', 'admin123')}
                      >
                        👤 Admin: admin@techstore.com
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => fillDemoUser('usuario@techstore.com', 'user123')}
                      >
                        👤 Usuario: usuario@techstore.com
                      </Button>
                    </div>
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

export default Login;