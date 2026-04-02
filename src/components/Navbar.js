import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaLaptop, FaCog, FaUser, FaSignInAlt, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function AppNavbar() {
  const { getTotalItems } = useCart();
  const { isAuthenticated, isAdmin, logout, userName, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Navbar expand="lg" className="navbar-techstore mb-0">
      <Container fluid className="px-3 px-lg-4">

        {/* Logo */}
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <FaLaptop />
            TechStore
          </Navbar.Brand>
        </LinkContainer>

        {/* Barra de busqueda centro - solo desktop */}
        <form className="navbar-search d-none d-lg-flex" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-search px-3">
              <FaSearch />
            </button>
          </div>
        </form>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          {/* Busqueda en mobile */}
          <form className="navbar-search d-flex d-lg-none my-2" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn-search px-3">
                <FaSearch />
              </button>
            </div>
          </form>

          <Nav className="ms-lg-auto align-items-lg-center gap-1">

            {/* Carrito */}
            <LinkContainer to="/carrito">
              <Nav.Link className="position-relative d-flex align-items-center gap-1">
                <FaShoppingCart size={18} />
                <span>Carrito</span>
                {totalItems > 0 && (
                  <Badge
                    pill
                    className="cart-badge position-absolute"
                    style={{ top: '2px', right: '2px', fontSize: '0.65rem' }}
                  >
                    {totalItems}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {isAuthenticated() ? (
              <>
                {isAdmin() && (
                  <LinkContainer to="/admin">
                    <Nav.Link className="d-flex align-items-center gap-1">
                      <FaCog size={16} />
                      <span>Admin</span>
                    </Nav.Link>
                  </LinkContainer>
                )}

                <Dropdown as={Nav.Item} align="end">
                  <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center gap-1 text-white">
                    <FaUser size={16} />
                    <span>{userName}</span>
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
                        <Dropdown.Item>
                          <FaUser className="me-2" size={13} />
                          Mi Cuenta
                        </Dropdown.Item>
                      </LinkContainer>
                    )}
                    {isAdmin() && (
                      <LinkContainer to="/admin">
                        <Dropdown.Item>
                          <FaCog className="me-2" size={13} />
                          Panel de Admin
                        </Dropdown.Item>
                      </LinkContainer>
                    )}
                    <LinkContainer to="/carrito">
                      <Dropdown.Item>
                        <FaShoppingCart className="me-2" size={13} />
                        Mi carrito
                        {totalItems > 0 && (
                          <Badge bg="secondary" className="ms-2">{totalItems}</Badge>
                        )}
                      </Dropdown.Item>
                    </LinkContainer>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} className="text-danger">
                      <FaSignOutAlt className="me-2" size={13} />
                      Cerrar Sesion
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link className="d-flex align-items-center gap-1">
                    <FaSignInAlt size={16} />
                    <span>Ingresar</span>
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link
                    className="d-flex align-items-center gap-1 px-3 py-1 rounded"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <FaUser size={14} />
                    <span>Registrarse</span>
                  </Nav.Link>
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
