import { create } from "zustand"
import { toast } from "sonner"
import { createClient } from "../supabase/client"
import { Caja, Precio } from "@/shared/types/supabase.types";

const supabase = createClient();


type CajasStore = {
  cajas: Caja[]
  fetchCajas: () => Promise<void>
  fetchCajaById: (id: string) => Promise<Caja | null>
  createCaja: (values: any) => Promise<Caja | null>
  updateCaja: (values: any, id: string) => Promise<void>
  deleteCaja: (id: string) => Promise<void>
}

export const useCajasStore = create<CajasStore>((set, get) => ({
  cajas: [],

  fetchCajas: async () => {
    try {
      const { data, error } = await supabase
        .from('cajas')
        .select('*')
        .order('created_at', { ascending: false }); // Ordenar por más reciente

      if (error) throw error;
      set({ cajas: data ?? [] });
    } catch (error) {
      toast.error('No se pudieron cargar las cajas');
    }
  },

  fetchCajaById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('cajas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      toast.error('No se pudo cargar la caja');
      return null;
    }
  },

  createCaja: async (values) => {
    try {
      const cajaData: Partial<Caja> = {
        name: values.name,
        description: values.description,
      };

      const { data, error } = await supabase
        .from('cajas')
        .insert(cajaData)
        .select()
        .single();

      if (error) {
        toast.error('La caja no se pudo crear, verifica que los datos sean correctos');
        return null;
      }

      if (data) {
        toast.success('Caja creada correctamente');
        set({ cajas: [data, ...get().cajas] });

        return data;
      }
    } catch (error) {
      toast.error('La caja no se pudo crear');
      return null;
    }
  },

  updateCaja: async (values, id) => {
    try {
      const cajaData: Partial<Caja> = {
        name: values.name,
        description: values.description,
      };

      const { data, error } = await supabase
        .from('cajas')
        .update(cajaData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        toast.success('Caja actualizada correctamente');
        set({ cajas: [data, ...get().cajas.filter(caja => caja.id !== id)] });
      }
    } catch (error) {
      toast.error('La caja no se pudo actualizar');
    }
  },

  deleteCaja: async (id) => {
    try {
      const { data, error } = await supabase
        .from('cajas')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        toast.success('Caja eliminada correctamente');
        set({
          cajas: get().cajas.filter(
            caja => caja.id !== id
          )
        });
      }
    } catch (error) {
      toast.error('La caja no se pudo eliminar');
    }
  }
}))