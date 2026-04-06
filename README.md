# TechStore — E-commerce React

Tienda online de tecnología lista para vender a clientes. Frontend en React, backend en Node.js para envío de emails de confirmación.

**Demo:** https://jgastonmurua.github.io/techstore-ecommerce

---

## Stack

- **Frontend:** React 18, React Bootstrap, React Router v6, Context API
- **Backend:** Node.js + Express + Resend (emails)
- **Deploy frontend:** GitHub Pages (automático con GitHub Actions)
- **Deploy backend:** Render.com (free tier)
- **Datos:** MockAPI (productos)

---

## Para adaptar a un nuevo cliente

Solo hay que modificar **un archivo**: `src/config/cliente.js`

```js
export const CONFIG = {
  nombreTienda: 'NombreDeLaTienda',
  emailContacto: 'email@delcliente.com',
  whatsapp: '549XXXXXXXXXX',       // Código de país + número sin espacios
  envioGratisDesde: 50000,         // Monto mínimo para envío gratis
  costoEnvio: 5000,
  redes: {
    email: 'email@delcliente.com',
    github: 'https://github.com/...',
    linkedin: 'https://linkedin.com/in/...',
  },
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',
};
```

---

## Checklist para nuevo cliente

### 1. Frontend
- [ ] Editar `src/config/cliente.js` con los datos del cliente
- [ ] Reemplazar logo/favicon en `public/index.html`
- [ ] Actualizar meta tags OG (título, descripción, URL) en `public/index.html`
- [ ] Cambiar colores en `src/App.css` (variables `--ts-purple`, `--ts-teal`)
- [ ] Actualizar `src/components/Footer.js` con datos del cliente

### 2. Backend de emails
- [ ] Crear cuenta en **resend.com**
- [ ] Verificar el dominio del cliente en Resend (para que emails no vayan a spam)
- [ ] Crear API Key en Resend
- [ ] Agregar variable `RESEND_API_KEY` en Render
- [ ] Cambiar `from` en `backend/server.js` al email del dominio verificado

### 3. Deploy
- [ ] Hacer fork o clonar el repo para el cliente
- [ ] Conectar a GitHub Pages (o Vercel/Netlify)
- [ ] Deploy del backend en Render.com (root directory: `backend`, start: `node server.js`)
- [ ] Agregar secret `REACT_APP_BACKEND_URL` en GitHub Actions con la URL del backend
- [ ] Agregar productos en MockAPI (o conectar a base de datos real)

---

## Variables de entorno

### Frontend (GitHub → Settings → Secrets → Actions)
| Variable | Descripción |
|---|---|
| `REACT_APP_BACKEND_URL` | URL del backend (ej: https://xxx.onrender.com) |

### Backend (Render → Environment)
| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API Key de resend.com |

---

## Desarrollo local

```bash
# Frontend
npm install
npm start

# Backend
cd backend
npm install
node server.js
```

Para el backend local, crear `backend/.env`:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
PORT=3001
```

---

## Estructura

```
/
├── src/
│   ├── config/cliente.js      <- ÚNICO archivo a editar por cliente
│   ├── pages/
│   ├── components/
│   └── context/
├── backend/
│   ├── server.js              <- Servidor de emails (Resend)
│   └── package.json
└── public/
```

---

Desarrollado por [Gaston Murua](https://linkedin.com/in/jgastonmurua) — Talento Tech 2025
