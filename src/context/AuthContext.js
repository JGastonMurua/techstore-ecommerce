import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Usuarios simulados (en producción vendría de una API)
const DEMO_USERS = [
  {
    id: 1,
    email: 'admin@techstore.com',
    password: 'admin123',
    role: 'admin',
    name: 'Administrador',
    lastName: 'TechStore'
  },
  {
    id: 2,
    email: 'usuario@techstore.com',
    password: 'user123',
    role: 'user',
    name: 'Usuario',
    lastName: 'Demo'
  },
  {
    id: 3,
    email: 'demo@demo.com',
    password: 'demo123',
    role: 'user',
    name: 'Demo',
    lastName: 'User'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay usuario logueado al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('techstore_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('techstore_user');
      }
    }
    setLoading(false);
  }, []);

  // Función de login
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      // Buscar usuario en la lista de demo
      const foundUser = DEMO_USERS.find(
        user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );

      if (!foundUser) {
        throw new Error('Credenciales inválidas');
      }

      // Crear datos del usuario (sin la contraseña)
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
        lastName: foundUser.lastName,
        loginTime: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem('techstore_user', JSON.stringify(userData));
      
      // Actualizar estado
      setUser(userData);
      
      toast.success(`¡Bienvenido ${userData.name}!`);
      
      return { success: true, user: userData };

    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro (simulado)
  const register = async (userData) => {
    try {
      setLoading(true);

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar si el email ya existe
      const emailExists = DEMO_USERS.some(
        user => user.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (emailExists) {
        throw new Error('Este email ya está registrado');
      }

      // En una app real, aquí enviarías los datos al servidor
      // Por ahora, solo simularemos el registro exitoso

      const newUser = {
        id: Date.now(), // ID temporal
        email: userData.email,
        role: 'user',
        name: userData.name,
        lastName: userData.lastName,
        loginTime: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem('techstore_user', JSON.stringify(newUser));
      
      // Actualizar estado
      setUser(newUser);
      
      toast.success(`¡Registro exitoso! Bienvenido ${newUser.name}!`);
      
      return { success: true, user: newUser };

    } catch (error) {
      toast.error(error.message || 'Error al registrar usuario');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('techstore_user');
    setUser(null);
    toast.info('Sesión cerrada correctamente');
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return user !== null;
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Verificar si el usuario puede acceder a una ruta
  const canAccess = (requiredRole = null) => {
    if (!isAuthenticated()) return false;
    if (!requiredRole) return true;
    return user.role === requiredRole;
  };

  // Obtener información del usuario
  const getUserInfo = () => {
    return user;
  };

  // Actualizar perfil del usuario
  const updateProfile = async (newData) => {
    try {
      const updatedUser = { ...user, ...newData };
      
      // Guardar en localStorage
      localStorage.setItem('techstore_user', JSON.stringify(updatedUser));
      
      // Actualizar estado
      setUser(updatedUser);
      
      toast.success('Perfil actualizado correctamente');
      
      return { success: true, user: updatedUser };
    } catch (error) {
      toast.error('Error al actualizar perfil');
      return { success: false, error: error.message };
    }
  };

  const value = {
    // Estado
    user,
    loading,
    
    // Funciones de autenticación
    login,
    register,
    logout,
    
    // Funciones de verificación
    isAuthenticated,
    isAdmin,
    canAccess,
    getUserInfo,
    updateProfile,
    
    // Datos útiles
    isLoggedIn: isAuthenticated(),
    userRole: user?.role || null,
    userName: user ? `${user.name} ${user.lastName}` : null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// Componente para mostrar info de usuarios demo
export const DemoUsers = () => {
  return (
    <div className="mt-3">
      <small className="text-muted d-block mb-2">
        <strong>Usuarios de prueba:</strong>
      </small>
      {DEMO_USERS.map(user => (
        <small key={user.id} className="d-block text-muted">
          📧 {user.email} | 🔑 {user.password} | 👤 {user.role}
        </small>
      ))}
    </div>
  );
};