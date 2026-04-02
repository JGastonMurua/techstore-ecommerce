# TechStore - E-commerce de Tecnologia

> Proyecto Final - Curso de React - Talento Tech

E-commerce completo de productos tecnologicos desarrollado con React, con CRUD, autenticacion, carrito de compras y panel de administracion.

## Informacion del Proyecto

- **Alumno:** Gaston Murua
- **Profesor:** Nicolas Fernandez ([nmfernandez1982](https://github.com/nmfernandez1982))
- **Institucion:** Talento Tech
- **Modalidad:** Virtual
- **Duracion:** 1 Cuatrimestre
- **Tipo:** Proyecto Individual

## Demo en Vivo

[Ver TechStore en funcionamiento](https://jgastonmurua.github.io/techstore-ecommerce/)

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **React Router DOM 6** - Navegacion entre paginas
- **React Bootstrap 2** - Componentes UI responsivos
- **React Icons 4** - Iconografia
- **React Helmet 6** - Gestion de meta tags
- **React Toastify 9** - Notificaciones

### Backend y API
- **MockAPI** - API REST para desarrollo
- **Axios** - Cliente HTTP

### Estilos
- **Bootstrap 5** - Framework CSS responsivo
- **CSS Custom** - Estilos personalizados

## Arquitectura del Proyecto

```
src/
├── components/
│   ├── ConfirmModal.js
│   ├── Loading.js
│   ├── Navbar.js
│   ├── Pagination.js
│   ├── ProductCard.js
│   ├── ProductForm.js
│   ├── ProtectedRoute.js
│   └── SearchBar.js
├── context/
│   ├── AuthContext.js
│   ├── CartContext.js
│   └── ProductContext.js
├── pages/
│   ├── Admin.js
│   ├── Cart.js
│   ├── Home.js
│   ├── Login.js
│   ├── Products.js
│   ├── Register.js
│   └── UserDashboard.js
├── services/
│   └── api.js
└── App.js
```

## Funcionalidades

### Para Usuarios
- Catalogo de productos con busqueda y filtros
- Carrito de compras con persistencia en localStorage
- Sistema de autenticacion (login/registro)
- Dashboard personal con informacion de cuenta
- Gestion de stock en tiempo real
- Proceso de compra con integracion a MercadoPago

### Para Administradores
- CRUD completo de productos
- Panel de administracion con estadisticas
- Gestion de inventario con alertas de stock

## Instalacion

```bash
git clone https://github.com/JGastonMurua/techstore-ecommerce.git
cd techstore-ecommerce
npm install
npm start
```

## Credenciales de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@techstore.com | admin123 |
| Usuario | usuario@techstore.com | user123 |
| Demo | demo@demo.com | demo123 |

## Contacto

**Gaston Murua**
- GitHub: [@JGastonMurua](https://github.com/JGastonMurua)
- Email: gastton.murua@gmail.com
