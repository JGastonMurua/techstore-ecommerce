import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productAPI, validateProduct } from '../services/api';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para búsqueda y paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('default');
    const [onlyInStock, setOnlyInStock] = useState(false);
    const productsPerPage = 8;

    // Cargar productos al iniciar
    useEffect(() => {
        loadProducts();
    }, []);

    // Función para cargar todos los productos
    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productAPI.getAll();
            console.log('📦 Productos cargados desde API:', response.data);
            console.log('🆔 IDs disponibles:', response.data.map(p => `${p.id} (${typeof p.id})`));
            setProducts(response.data);
        } catch (err) {
            setError('Error al cargar productos');
            toast.error('Error al cargar productos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Función para agregar producto
    const addProduct = async (productData) => {
        try {
            const errors = validateProduct(productData);
            if (errors.length > 0) {
                toast.error(errors.join(', '));
                return false;
            }

            setLoading(true);
            const response = await productAPI.create(productData);
            console.log('✅ Producto creado:', response.data);

            // Recargar productos para asegurar sincronización
            await loadProducts();

            toast.success('Producto agregado exitosamente');
            return true;
        } catch (err) {
            toast.error('Error al agregar producto');
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar producto
    const updateProduct = async (id, productData) => {
        try {
            const errors = validateProduct(productData);
            if (errors.length > 0) {
                toast.error(errors.join(', '));
                return false;
            }

            setLoading(true);

            // NO convertir el ID - usar tal como viene
            console.log('🔄 Actualizando producto con ID:', id, 'tipo:', typeof id);
            console.log('📝 Datos a actualizar:', productData);

            const response = await productAPI.update(id, productData);
            console.log('✅ Producto actualizado:', response.data);

            // Recargar productos para asegurar sincronización
            await loadProducts();

            toast.success('Producto actualizado exitosamente');
            return true;
        } catch (err) {
            toast.error('Error al actualizar producto');
            console.error('Error completo:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función para eliminar producto
    const deleteProduct = async (id) => {
        try {
            setLoading(true);
            const stringId = String(id);

            console.log('🗑️ Eliminando producto con ID:', stringId, 'tipo:', typeof stringId);

            await productAPI.delete(stringId);

            setProducts(prev => prev.filter(product => product.id !== stringId));

            toast.success('Producto eliminado exitosamente');
            return true;

        } catch (err) {
            toast.error('Error al eliminar producto');
            console.error('❌ Error completo:', err);
            return false;

        } finally {
            setLoading(false);
        }
    };




    // Función para obtener producto por ID
    const getProductById = (id) => {
        // Comparar IDs directamente sin conversión
        return products.find(product => product.id === id);
    };

    // Función para filtrar productos
    const getFilteredProducts = () => {
        let filtered = [...products];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.categoria?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.marca?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (onlyInStock) {
            filtered = filtered.filter(product => (product.stock || 0) > 0);
        }

        if (sortOrder === 'price-asc') {
            filtered = [...filtered].sort((a, b) => (a.precio || 0) - (b.precio || 0));
        } else if (sortOrder === 'price-desc') {
            filtered = [...filtered].sort((a, b) => (b.precio || 0) - (a.precio || 0));
        }

        return filtered;
    };

    // Función para obtener productos paginados
    const getPaginatedProducts = () => {
        const filtered = getFilteredProducts();
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return filtered.slice(startIndex, endIndex);
    };

    // Función para obtener total de páginas
    const getTotalPages = () => {
        const filtered = getFilteredProducts();
        return Math.ceil(filtered.length / productsPerPage);
    };

    // Función para obtener categorías únicas
    const getCategories = () => {
        const categories = products.map(product => product.categoria).filter(Boolean);
        return [...new Set(categories)];
    };

    const value = {
        // Estados
        products,
        loading,
        error,
        searchTerm,
        currentPage,
        selectedCategory,
        productsPerPage,

        // Funciones CRUD
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,

        // Funciones de filtrado y paginación
        setSearchTerm,
        setCurrentPage,
        setSelectedCategory,
        sortOrder,
        setSortOrder,
        onlyInStock,
        setOnlyInStock,
        getFilteredProducts,
        getPaginatedProducts,
        getTotalPages,
        getCategories
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts debe usarse dentro de ProductProvider');
    }
    return context;
}