import axios from 'axios';

// Reemplaza con tu URL de MockAPI
const API_URL = 'https://687f2671efe65e520088877b.mockapi.io/productos';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error API:', error);
    throw error;
  }
);

export const productAPI = {
  // Obtener todos los productos
  getAll: () => api.get('/'),
  
  // Obtener producto por ID
  getById: (id) => api.get(`/${id}`),
  
  // Crear producto
  create: (data) => api.post('/', data),
  
  // Actualizar producto
  update: (id, data) => api.put(`/${id}`, data),
  
  // Eliminar producto
  delete: (id) => api.delete(`/${id}`)
};

// Validación simple
export const validateProduct = (product) => {
  const errors = [];
  
  if (!product.nombre || product.nombre.trim().length === 0) {
    errors.push('El nombre es obligatorio');
  }
  
  if (!product.precio || product.precio <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }
  
  if (!product.descripcion || product.descripcion.trim().length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  }
  
  return errors;
};