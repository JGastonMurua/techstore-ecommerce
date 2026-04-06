// ================================================================
//  CONFIGURACION DEL CLIENTE — editá este archivo para cada cliente
// ================================================================

export const CONFIG = {

  // Datos generales de la tienda
  nombreTienda:  'TechStore',
  slogan:        'Tu tienda de tecnología online',

  // Contacto
  emailContacto: 'Gastton.murua@gmail.com',
  whatsapp:      '5491130484275',  // formato: 54 + 9 + cod.area + numero

  // Envio
  envioGratisDesde: 50000,         // en ARS
  costoEnvio:       5000,

  // Redes sociales
  redes: {
    email:    'Gastton.murua@gmail.com',
    github:   'https://github.com/JGastonMurua',
    linkedin: 'https://linkedin.com/in/jgastonmurua',
  },

  // Backend — reemplazá con la URL de Railway una vez deployado
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',

  // Frontend — reemplazá con la URL de producción si cambia
  frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'https://jgastonmurua.github.io/techstore-ecommerce',

};
