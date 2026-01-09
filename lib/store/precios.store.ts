import { create } from "zustand"
import { toast } from "sonner"
import { createClient } from "../supabase/client"
import { Precio } from "@/shared/types/supabase.types";

const supabase = createClient();


type PreciosStore = {
  precios: Precio[]

  fetchPrecios: () => Promise<void>
  fetchPrecioById: (id: string) => Promise<Precio | null>
  createPrecio: (values: any) => Promise<Precio | null>
  updatePrecio: (values: any, id: string) => Promise<void>
  deletePrecio: (id: string) => Promise<void>
}

export const usePreciosStore = create<PreciosStore>((set, get) => ({
  precios: [],

  fetchPrecios: async () => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .select('*')
        .order('created_at', { ascending: false }); // Ordenar por más reciente

      if (error) throw error;

      set({ precios: data ?? [] });
    } catch (error) {
      console.error('Error al obtener precios:', error);
      toast.error('No se pudieron cargar los precios');
    }
  },

  fetchPrecioById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error al obtener precio por ID:', error);
      toast.error('No se pudo cargar el precio');
      return null;
    }
  },

  createPrecio: async (values) => {
    try {
      const precioData: Partial<Precio> = {
        name: values.name,
        price: values.price,
        description: values.description,
        default: values.default || false
      };

      const { data, error } = await supabase
        .from('precios')
        .insert(precioData)
        .select()
        .single();

      if (error) {
        toast.error('El precio no se pudo crear, verifica que los datos sean correctos');
        return null;
      };

      // El realtime se encargará de actualizar el estado
      // Pero mantenemos esto por si acaso el realtime no está activo
      if (data) {
        toast.success('Precio creado correctamente');
        set({ precios: [data, ...get().precios] });
        return data;
      }
    } catch (error) {
      toast.error('El precio no se pudo crear');
      return null;
    }
  },

  updatePrecio: async (values, id) => {
    try {
      const precioData: Partial<Precio> = {
        name: values.name,
        price: values.price,
        description: values.description,
        default: values.default || false
      };

      const { data, error } = await supabase
        .from('precios')
        .update(precioData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        set({
          precios: get().precios.map(
            precio => precio.id === id ? data : precio
          )
        });
        toast.success('Precio actualizado correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar precio:', error);
      toast.error('El precio no se pudo actualizar');
    }
  },

  deletePrecio: async (id) => {
    try {
      // 🗑️ Obtener la inscripción para eliminar su imagen si existe
      const precioToDelete = get().precios.find(i => i.id === id);

      const { data, error } = await supabase
        .from('precios')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // El realtime se encargará de actualizar el estado
      if (data) {
        toast.success('Precio eliminado correctamente');
        set({
          precios: get().precios.filter(
            precio => precio.id !== id
          )
        });
      }
    } catch (error) {
      console.error('Error al eliminar precio:', error);
      toast.error('El precio no se pudo eliminar');
    }
  }
}))