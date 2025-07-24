import React from 'react';
import { Navbar, Nav, Container, Badge, Dropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaShoppingCart, FaLaptop, FaCog, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function AppNavbar() {
  const { getTotalItems } = useCart();
  const { isAuthenticated, isAdmin, logout, userName, user } = useAuth();
  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-0">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <FaLaptop className="me-2" />
            TechStore
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Inicio</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/productos">
              <Nav.Link>Productos</Nav.Link>
            </LinkContainer>
          </Nav>
          
          <Nav className="ms-auto">
            <LinkContainer to="/carrito">
              <Nav.Link className="position-relative">
                <FaShoppingCart className="me-1" />
                Carrito
                {totalItems > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {totalItems}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            
            {/* Mostrar diferentes opciones según el estado de autenticación */}
            {isAuthenticated() ? (
              <>
                {/* Si es admin, mostrar enlace al panel */}
                {isAdmin() && (
                  <LinkContainer to="/admin">
                    <Nav.Link>
                      <FaCog className="me-1" />
                      Admin
                    </Nav.Link>
                  </LinkContainer>
                )}
                
                {/* Dropdown del usuario */}
                <Dropdown as={Nav.Item} align="end">
                  <Dropdown.Toggle as={Nav.Link} className="text-white text-decoration-none">
                    <FaUser className="me-1" />
                    {userName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <small className="text-muted">
                        {user?.email}
                        <br />
                        <Badge bg={isAdmin() ? "danger" : "primary"} className="mt-1">
                          {isAdmin() ? "Administrador" : "Usuario"}
                        </Badge>
                      </small>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    {!isAdmin() && (
                      <>
                        <LinkContainer to="/mi-cuenta">
                          <Dropdown.Item>
                            <FaUser className="me-2" />
                            Mi Cuenta
                          </Dropdown.Item>
                        </LinkContainer>
                        <Dropdown.Divider />
                      </>
                    )}
                    {isAdmin() && (
                      <>
                        <LinkContainer to="/admin">
                          <Dropdown.Item>
                            <FaCog className="me-2" />
                            Panel de Admin
                          </Dropdown.Item>
                        </LinkContainer>
                        <Dropdown.Divider />
                      </>
                    )}
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              /* Si no está autenticado, mostrar botones de login */
              <>
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaSignInAlt className="me-1" />
                    Iniciar Sesión
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="outline-light" size="sm" className="ms-2">
                    Registrarse
                  </Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;