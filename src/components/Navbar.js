import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaLaptop, FaCog, FaUser, FaSignInAlt, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Laptops', 'Smartphones', 'Tablets', 'Accesorios'];

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

          {/* Busqueda — desktop */}
          <form className="navbar-search d-none d-lg-flex" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Busca productos, marcas y categorias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn-search">
                <FaSearch size={14} />
              </button>
            </div>
          </form>

          <Navbar.Toggle aria-controls="navbar-nav" />

          <Navbar.Collapse id="navbar-nav">
            {/* Busqueda — mobile */}
            <form className="navbar-search d-flex d-lg-none my-2" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn-search">
                  <FaSearch size={13} />
                </button>
              </div>
            </form>

            <Nav className="ms-lg-auto align-items-lg-center gap-1">

              {/* Carrito */}
              <LinkContainer to="/carrito">
                <Nav.Link className="position-relative d-flex align-items-center gap-1">
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
              </LinkContainer>

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
                      <Dropdown.Item onClick={logout} className="text-danger">
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

      {/* Barra de categorias — EBAY STYLE */}
      <div className="categories-bar d-none d-lg-block">
        <Container fluid className="px-3 px-lg-4">
          <div className="inner">
            <LinkContainer to="/productos">
              <a className="category-link">Todos</a>
            </LinkContainer>
            {CATEGORIES.map(cat => (
              <LinkContainer key={cat} to={`/productos?q=${cat}`}>
                <a className="category-link">{cat}</a>
              </LinkContainer>
            ))}
            <LinkContainer to="/productos">
              <a className="category-link">Ofertas</a>
            </LinkContainer>
          </div>
        </Container>
      </div>
    </>
  );
}

export default AppNavbar;
