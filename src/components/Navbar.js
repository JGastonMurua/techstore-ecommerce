import React from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaLaptop, FaCog, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';

function AppNavbar() {
  const { getTotalItems, openCart } = useCart();
  const { isAuthenticated, isAdmin, logout, userName, user } = useAuth();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  return (
    <>
      {/* Barra principal — BLANCA */}
      <Navbar expand="lg" className="navbar-techstore mb-0" style={{ paddingBottom: 0 }}>
        <Container fluid className="px-3 px-lg-4">

          {/* Logo */}
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center gap-2">
              <FaLaptop size={20} />
              TechStore
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="navbar-nav" />

          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-lg-auto align-items-lg-center gap-1">

              {/* Carrito — abre drawer lateral */}
              <Nav.Link
                onClick={openCart}
                className="position-relative d-flex align-items-center gap-1"
                style={{ cursor: 'pointer' }}
              >
                <FaShoppingCart size={17} />
                <span style={{ fontSize: '0.85rem' }}>Carrito</span>
                {totalItems > 0 && (
                  <Badge
                    pill
                    className="cart-badge position-absolute"
                    style={{ top: '2px', right: '0px' }}
                  >
                    {totalItems}
                  </Badge>
                )}
              </Nav.Link>

              {isAuthenticated() ? (
                <>
                  {isAdmin() && (
                    <LinkContainer to="/admin">
                      <Nav.Link className="d-flex align-items-center gap-1">
                        <FaCog size={15} />
                        <span style={{ fontSize: '0.85rem' }}>Admin</span>
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  <Dropdown as={Nav.Item} align="end">
                    <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center gap-1">
                      <FaUser size={15} />
                      <span style={{ fontSize: '0.85rem' }}>{userName}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Header>
                        <small className="text-muted d-block">{user?.email}</small>
                        <Badge bg={isAdmin() ? 'danger' : 'primary'} className="mt-1">
                          {isAdmin() ? 'Administrador' : 'Usuario'}
                        </Badge>
                      </Dropdown.Header>
                      <Dropdown.Divider />
                      {!isAdmin() && (
                        <LinkContainer to="/mi-cuenta">
                          <Dropdown.Item><FaUser className="me-2" size={12} />Mi Cuenta</Dropdown.Item>
                        </LinkContainer>
                      )}
                      {isAdmin() && (
                        <LinkContainer to="/admin">
                          <Dropdown.Item><FaCog className="me-2" size={12} />Panel Admin</Dropdown.Item>
                        </LinkContainer>
                      )}
                      <LinkContainer to="/carrito">
                        <Dropdown.Item>
                          <FaShoppingCart className="me-2" size={12} />Mi carrito
                          {totalItems > 0 && <Badge bg="secondary" className="ms-2">{totalItems}</Badge>}
                        </Dropdown.Item>
                      </LinkContainer>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="text-danger">
                        <FaSignOutAlt className="me-2" size={12} />Cerrar Sesion
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link className="d-flex align-items-center gap-1">
                      <FaSignInAlt size={15} />
                      <span style={{ fontSize: '0.85rem' }}>Ingresar</span>
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link
                      className="d-flex align-items-center gap-1 px-3 py-1 rounded"
                      style={{ background: 'var(--ts-purple)', color: 'white', fontSize: '0.85rem' }}
                    >
                      <FaUser size={13} />
                      Registrarse
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <CartDrawer />
    </>
  );
}

export default AppNavbar;
