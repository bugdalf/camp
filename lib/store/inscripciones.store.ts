import { create } from "zustand"
import { toast } from "sonner"
import { createClient } from "../supabase/client"
import { Inscripcion } from "@/shared/types/supabase.types";

let inscripcionesChannel: ReturnType<typeof supabase.channel> | null = null
const supabase = createClient();

// 🔧 Función helper para subir imágenes a Supabase Storage
const uploadPaymentRecipe = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `payment-recipes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('inscripciones') // 📦 Nombre de tu bucket en Supabase Storage
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      toast.error('No se pudo subir el comprobante');
      return null;
    }

    // 🔗 Obtener URL pública
    const { data } = supabase.storage
      .from('inscripciones')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error en uploadPaymentRecipe:', error);
    toast.error('Error al procesar la imagen');
    return null;
  }
};

// 🗑️ Función helper para eliminar imagen anterior
const deletePaymentRecipe = async (url: string): Promise<void> => {
  try {
    // Extraer el path del URL público
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // El path generalmente es: /storage/v1/object/public/inscripciones/payment-recipes/filename.jpg
    const bucketIndex = pathParts.indexOf('inscripciones');
    if (bucketIndex !== -1) {
      const filePath = pathParts.slice(bucketIndex + 1).join('/');

      await supabase.storage
        .from('inscripciones')
        .remove([filePath]);
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    // No mostramos toast aquí porque es una operación silenciosa
  }
};

type InscripcionesStore = {
  inscripciones: Inscripcion[]
  fetchInscripciones: () => Promise<void>
  fetchInscripcionById: (id: string) => Promise<Inscripcion | null>
  createInscripcion: (values: any) => Promise<boolean | undefined>
  updateInscripcion: (values: any, id: string) => Promise<void>
  deleteInscripcion: (id: string) => Promise<void>
  deleteSoftInscripcion: (id: string) => Promise<void>

  subscribeToInscripciones: () => void
  unsubscribeFromInscripciones: () => void
}

export const useInscripcionesStore = create<InscripcionesStore>((set, get) => ({
  inscripciones: [],

  fetchInscripciones: async () => {
    try {
      const { data, error } = await supabase
        .from('inscripciones')
        .select('*')
        .order('created_at', { ascending: false }); // Ordenar por más reciente

      if (error) throw error;

      set({ inscripciones: data ?? [] });
    } catch (error) {
      toast.error('No se pudieron cargar las inscripciones');
    }
  },

  fetchInscripcionById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('inscripciones')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error('No se pudo cargar la inscripción');
        return null;
      }
      return data;
    } catch (error) {
      toast.error('No se pudo cargar la inscripción');
      return null;
    }
  },

  createInscripcion: async (values) => {
    try {
      let paymentRecipeUrl = values.payment_recipe_url;

      // 📤 Si hay un archivo File, subirlo primero
      if (values.payment_recipe_url instanceof File) {
        paymentRecipeUrl = await uploadPaymentRecipe(values.payment_recipe_url);
        if (!paymentRecipeUrl) {
          return false; // Ya se mostró el error en uploadPaymentRecipe
        }
      }

      // 📝 Preparar datos para insertar
      const inscripcionData: Partial<Inscripcion> = {
        name: values.name,
        dni: values.dni,
        age: values.age,
        is_under_18: values.is_under_18 || false,
        cellphone_number: values.cellphone_number || null,
        payment_method: values.payment_method,
        payment_recipe_url: paymentRecipeUrl || null,
        payment_checked: values.payment_checked || false,
        parent_name: values.parent_name || null,
        parent_cellphone_number: values.parent_cellphone_number || null,
        terms_accepted: values.terms_accepted || false,
        register_by: values.register_by || null,
      };

      const { data, error } = await supabase
        .from('inscripciones')
        .insert(inscripcionData)
        .select()
        .single();

      if (error) {
        if (error.code == '23505') {
          toast.error('Ya existe una inscripción con el mismo DNI, contactanos');
          return false;
        }
        toast.error('La inscripción no se pudo registrar, verifica que los datos sean correctos');
        console.error('Error al crear inscripción:', error);
        return false;
      };

      if (data) {
        toast.success('Inscripción creada correctamente');
        return true;
      }

      // El realtime se encargará de actualizar el estado
      // Pero mantenemos esto por si acaso el realtime no está activo
      if (data && !inscripcionesChannel) {
        set({ inscripciones: [data, ...get().inscripciones] });
      }
    } catch (error) {
      console.error('Error al crear inscripción:', error);
      toast.error('La inscripción no se pudo crear');
      return false;
    }
  },

  updateInscripcion: async (values, id) => {
    try {
      let paymentRecipeUrl = values.payment_recipe_url;

      // 📤 Si hay un nuevo archivo File, subirlo
      if (values.payment_recipe_url instanceof File) {
        // 🗑️ Obtener la inscripción actual para eliminar la imagen anterior
        const currentInscripcion = get().inscripciones.find(i => i.id === id);
        if (currentInscripcion?.payment_recipe_url) {
          await deletePaymentRecipe(currentInscripcion.payment_recipe_url);
        }

        paymentRecipeUrl = await uploadPaymentRecipe(values.payment_recipe_url);
        if (!paymentRecipeUrl) {
          return; // Ya se mostró el error en uploadPaymentRecipe
        }
      }

      // 📝 Preparar datos para actualizar
      const inscripcionData: Partial<Inscripcion> = {
        name: values.name,
        dni: values.dni,
        age: values.age,
        is_under_18: values.is_under_18 || false,
        cellphone_number: values.cellphone_number || null,
        payment_method: values.payment_method,
        payment_recipe_url: paymentRecipeUrl || null,
        payment_checked: values.payment_checked || false,
        parent_name: values.parent_name || null,
        parent_cellphone_number: values.parent_cellphone_number || null,
        terms_accepted: values.terms_accepted || false,
      };

      const { data, error } = await supabase
        .from('inscripciones')
        .update(inscripcionData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast.error('La inscripción no se pudo actualizar, verifica que los datos sean correctos');
      };

      if (data) {
        toast.success('Inscripción actualizada correctamente');
      }

      // El realtime se encargará de actualizar el estado
      if (data && !inscripcionesChannel) {
        set({
          inscripciones: get().inscripciones.map(
            inscripcion => inscripcion.id === id ? data : inscripcion
          )
        });
      }
    } catch (error) {
      console.error('Error al actualizar inscripción:', error);
      toast.error('La inscripción no se pudo actualizar');
    }
  },

  deleteInscripcion: async (id) => {
    try {
      // 🗑️ Obtener la inscripción para eliminar su imagen si existe
      const inscripcionToDelete = get().inscripciones.find(i => i.id === id);

      const { data, error } = await supabase
        .from('inscripciones')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // 🗑️ Eliminar imagen asociada si existe
      if (inscripcionToDelete?.payment_recipe_url) {
        await deletePaymentRecipe(inscripcionToDelete.payment_recipe_url);
      }

      if (data) {
        toast.success('Inscripción eliminada correctamente');
      }

      // El realtime se encargará de actualizar el estado
      if (data && !inscripcionesChannel) {
        set({
          inscripciones: get().inscripciones.filter(
            inscripcion => inscripcion.id !== id
          )
        });
      }
    } catch (error) {
      console.error('Error al eliminar inscripción:', error);
      toast.error('La inscripción no se pudo eliminar');
    }
  },

  deleteSoftInscripcion: async (id) => {
    const inscripcionToDelete = get().inscripciones.find(i => i.id === id);
    try {
      const { data, error } = await supabase
        .from('inscripciones')
        .update({ is_active: inscripcionToDelete?.is_active ? false : true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        toast.success('Inscripción cancelada correctamente');
      }

      // El realtime se encargará de actualizar el estado
      if (data && !inscripcionesChannel) {
        set({
          inscripciones: get().inscripciones.map(
            inscripcion => inscripcion.id === id ? data : inscripcion
          )
        });
      }
    } catch (error) {
      console.error('Error al cancelar inscripción:', error);
      toast.error('La inscripción no se pudo cancelar');
    }
  },

  subscribeToInscripciones: () => {
    inscripcionesChannel = supabase
      .channel('inscripciones-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'inscripciones',
      }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          set({ inscripciones: [payload.new, ...get().inscripciones] });
        } else if (payload.eventType === 'UPDATE') {
          set({
            inscripciones: get().inscripciones.map(
              inscripcion => inscripcion.id === payload.new.id ? payload.new : inscripcion
            )
          });
        } else if (payload.eventType === 'DELETE') {
          set({
            inscripciones: get().inscripciones.filter(
              inscripcion => inscripcion.id !== payload.old.id
            )
          });
        }
      })
      .subscribe();
  },

  unsubscribeFromInscripciones: () => {
    if (inscripcionesChannel) {
      inscripcionesChannel.unsubscribe();
      inscripcionesChannel = null;
    }
  },
}))