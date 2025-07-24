# 🖥️ TechStore - E-commerce de Tecnología

> **Proyecto Final - Curso de React - Talento Tech**  

Un e-commerce completo de productos tecnológicos desarrollado con React, que incluye funcionalidades de CRUD, autenticación, carrito de compras y panel de administración.

## 📋 Información del Proyecto

- **Alumno:** Gastón Murúa
- **Profesor:** Nicolás Fernández ([nmfernandez1982](https://github.com/nmfernandez1982))
- **Institución:** Talento Tech
- **Modalidad:** Virtual
- **Duración:** 1 Cuatrimestre
- **Tipo:** Proyecto Individual

## 🚀 Demo en Vivo

**🔗 [Ver TechStore en funcionamiento](https://jgastonmurua.github.io/techstore-ecommerce/)**

## 🎯 Objetivos del Proyecto

Este proyecto fue desarrollado como trabajo final del curso de React, aplicando todos los conceptos aprendidos durante el cuatrimestre:

- Desarrollo de una SPA (Single Page Application) completa
- Implementación de componentes reutilizables
- Gestión de estado global con Context API
- Integración con APIs externas (MockAPI)
- Manejo de rutas y navegación
- Autenticación y autorización por roles
- Responsive design con Bootstrap

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **React Router DOM 6** - Navegación entre páginas
- **React Bootstrap 2** - Componentes UI responsivos
- **React Icons 4** - Iconografía
- **React Helmet 6** - Gestión de meta tags
- **React Toastify 9** - Notificaciones

### Backend y API
- **MockAPI** - API REST para desarrollo
- **Axios** - Cliente HTTP para peticiones

### Estilos y UI/UX
- **Bootstrap 5** - Framework CSS responsivo
- **CSS Custom** - Estilos personalizados
- **Animaciones CSS** - Transiciones y efectos

### Herramientas de Desarrollo
- **Create React App** - Configuración inicial
- **Git & GitHub** - Control de versiones
- **GitHub Pages** - Deployment automático
- **VSCode** - Editor de código

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ConfirmModal.js
│   ├── Loading.js
│   ├── Navbar.js
│   ├── Pagination.js
│   ├── ProductCard.js
│   ├── ProductForm.js
│   ├── ProtectedRoute.js
│   └── SearchBar.js
├── context/             # Gestión de estado global
│   ├── AuthContext.js   # Autenticación y usuarios
│   ├── CartContext.js   # Carrito de compras
│   └── ProductContext.js # CRUD de productos
├── pages/               # Páginas principales
│   ├── Admin.js         # Panel de administración
│   ├── Cart.js          # Carrito de compras
│   ├── Home.js          # Página de inicio
│   ├── Login.js         # Inicio de sesión
│   ├── Products.js      # Catálogo de productos
│   ├── Register.js      # Registro de usuarios
│   └── UserDashboard.js # Panel de usuario
├── services/            # Servicios y API
│   └── api.js           # Configuración MockAPI
└── App.js               # Componente raíz
```

## ⚡ Funcionalidades Implementadas

### 🛍️ Para Usuarios
- **Catálogo de productos** con búsqueda y filtros
- **Carrito de compras** con persistencia en localStorage
- **Sistema de autenticación** (login/register)
- **Dashboard personal** con información de cuenta
- **Gestión de stock** en tiempo real
- **Proceso de compra** simplificado
- **Diseño responsive** para móviles y desktop

### 👨‍💼 Para Administradores
- **CRUD completo** de productos (Crear, Leer, Actualizar, Eliminar)
- **Panel de administración** con estadísticas
- **Gestión de inventario** con alertas de stock
- **Dashboard ejecutivo** con métricas del negocio
- **Validaciones robustas** en formularios

### 🔧 Características Técnicas
- **Context API** para estado global
- **Rutas protegidas** por rol de usuario
- **Persistencia** en localStorage y API
- **Validación** de formularios en tiempo real
- **Notificaciones** toast para feedback
- **Paginación** inteligente
- **Skeleton screens** para estados de carga

## 🎨 Conceptos de React Aplicados

- **Componentes funcionales** con hooks
- **useState** para estado local
- **useEffect** para efectos secundarios
- **useContext** para consumo de contextos
- **Custom hooks** para lógica reutilizable
- **Conditional rendering** para mostrar contenido dinámico
- **Event handling** para interacciones del usuario
- **Props drilling** y su solución con Context
- **Controlled components** en formularios
- **Lifecycle methods** equivalentes con hooks

## 🔐 Sistema de Autenticación

### Usuarios de Prueba

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Admin** | admin@techstore.com | admin123 | CRUD completo, panel admin |
| **Usuario** | usuario@techstore.com | user123 | Compras, carrito, dashboard |
| **Demo** | demo@demo.com | demo123 | Usuario estándar |

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/JGastonMurua/techstore-ecommerce.git
cd techstore-ecommerce
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar API (opcional)**
```javascript
// src/services/api.js
const API_URL = 'tu-mockapi-endpoint';
```

4. **Iniciar desarrollo**
```bash
npm start
```

5. **Acceder a la aplicación**
```
http://localhost:3000
```

## 📦 Scripts Disponibles

```bash
npm start          # Servidor de desarrollo
npm run build      # Build para producción
npm test           # Ejecutar tests
npm run eject      # Exponer configuración
```

## 🎓 Aprendizajes Clave

Durante el desarrollo de este proyecto se consolidaron los siguientes conceptos:

### React Fundamentals
- Creación y composición de componentes
- Manejo del Virtual DOM
- Props y state management
- Event handling y forms

### React Avanzado
- Context API para estado global
- Custom hooks para lógica reutilizable
- Performance optimization
- Error boundaries y error handling

### Desarrollo Web Moderno
- SPA (Single Page Application) architecture
- RESTful API integration
- Responsive design principles
- User experience best practices

### Herramientas de Desarrollo
- Git workflow y version control
- Package management con npm
- Deployment con GitHub Pages
- Debugging y development tools

## 🔄 Flujo de Desarrollo

1. **Análisis de requerimientos** - Definición de funcionalidades
2. **Diseño de arquitectura** - Estructura de componentes y contextos
3. **Desarrollo iterativo** - Implementación por módulos
4. **Testing manual** - Pruebas de funcionalidad
5. **Deployment** - Publicación en GitHub Pages

## 🎯 Desafíos Superados

- **Estado global complejo** - Solucionado con Context API
- **Persistencia de datos** - localStorage + API externa
- **Autenticación por roles** - Sistema de rutas protegidas
- **Gestión de stock** - Validaciones en tiempo real
- **Responsive design** - Bootstrap + CSS custom
- **Performance** - Optimización de renderizado

## 🚀 Deployment

El proyecto está deployado automáticamente en GitHub Pages mediante GitHub Actions. Cada push a la rama `main` ejecuta el workflow de deployment.

**URL de producción:** https://jgastonmurua.github.io/techstore-ecommerce/

## 📞 Contacto

**Gastón Murúa**
- GitHub: [@JGastonMurua](https://github.com/JGastonMurua)
- Email: gastton.murua@gmail.com

**Profesor**
- GitHub: [@nmfernandez1982](https://github.com/nmfernandez1982)

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos como parte del curso de React en Talento Tech.

---

⭐ **Proyecto desarrollado con dedicación durante el curso de React - Talento Tech 2025**