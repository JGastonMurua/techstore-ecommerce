import supabase from './supabase';

export const productAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('disponible', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data };
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data };
  },

  create: async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    if (error) throw error;
    return { data };
  },

  update: async (id, productData) => {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return { data };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { data: {} };
  },
};

export const validateProduct = (product) => {
  const errors = [];
  if (!product.nombre || product.nombre.trim().length === 0)
    errors.push('El nombre es obligatorio');
  if (!product.precio || product.precio <= 0)
    errors.push('El precio debe ser mayor a 0');
  if (!product.descripcion || product.descripcion.trim().length < 10)
    errors.push('La descripción debe tener al menos 10 caracteres');
  return errors;
};
