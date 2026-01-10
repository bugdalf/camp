import { create } from "zustand"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "../supabase/client"
import { Inscripcion, Pago } from "@/shared/types/supabase.types";
import { usePreciosStore } from "./precios.store";

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

  selectedInscripcion: Inscripcion | null
  setSelectedInscripcion: (inscripcion: Inscripcion | null) => void

  fetchInscripciones: () => Promise<void>
  fetchInscripcionesCount: () => Promise<number>
  fetchInscripcionById: (id: string) => Promise<Inscripcion | null>
  createInscripcion: (values: any) => Promise<Inscripcion | null>
  createAutoInscripcion: (values: any) => Promise<Inscripcion | null>
  updateInscripcion: (values: any, id: string) => Promise<void>
  deleteInscripcion: (id: string) => Promise<void>
  deleteSoftInscripcion: (id: string) => Promise<void>

  handleCheckInInscripcion: (id: string) => Promise<void>

  //payments actions
  createPayment: (values: Record<string, any>, inscripcionId?: string) => Promise<void>
  updatePayment: (values: Record<string, any>, paymentId: string, inscripcionId?: string) => Promise<void>
  deletePayment: (paymentId: string, inscripcionId?: string) => Promise<void>

  subscribeToInscripciones: () => void
  unsubscribeFromInscripciones: () => void
}

export const useInscripcionesStore = create<InscripcionesStore>((set, get) => ({
  inscripciones: [],
  selectedInscripcion: null,
  setSelectedInscripcion: (inscripcion: Inscripcion | null) => set({ selectedInscripcion: inscripcion }),

  fetchInscripcionesCount: async () => {
    try {
      const { count, error } = await supabase
        .from('inscripciones')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      return count ?? 0;
    } catch (error) {
      toast.error('No se pudo cargar el conteo de inscripciones');
      return 0;
    }
  },

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
      const precios = usePreciosStore.getState().precios;
      const precio = precios.find(p => p.id === values.price_id);

      if (!precio) {
        toast.error('El precio no existe');
        return;
      }

      // 📝 Preparar datos para insertar
      const inscripcionData: Partial<Inscripcion> = {
        name: values.name,
        dni: values.dni,
        age: values.age,
        height: values.height,
        is_under_18: values.is_under_18 || false,
        cellphone_number: values.cellphone_number || null,
        price_id: precio.id,
        price_name: precio.name,
        price_amount: precio.price,
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
          toast.error('Ya existe una inscripción con el mismo DNI');
          return null;
        }
        toast.error('La inscripción no se pudo registrar, verifica que los datos sean correctos');
        return null;
      };

      // El realtime se encargará de actualizar el estado
      // Pero mantenemos esto por si acaso el realtime no está activo
      if (data && !inscripcionesChannel) {
        toast.success('Inscripción creada correctamente');
        set({ inscripciones: [data, ...get().inscripciones] });
        set({ selectedInscripcion: data });
        return data;
      }
    } catch (error) {
      toast.error('La inscripción no se pudo crear');
      return null;
    }
  },

  createAutoInscripcion: async (values) => {
    try {
      // 📝 Preparar datos para insertar
      const inscripcionData: Partial<Inscripcion> = {
        name: values.name,
        dni: values.dni,
        age: values.age,
        height: values.height,
        is_under_18: values.is_under_18 || false,
        cellphone_number: values.cellphone_number || null,
        price_id: values.precio_id,
        price_name: values.precio_name,
        price_amount: values.precio_price,
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
          toast.error('Ya existe una inscripción con el mismo DNI');
          return null;
        }
        toast.error('La inscripción no se pudo registrar, verifica que los datos sean correctos');
        return null;
      };

      if (data) {
        // 📤 Si hay un archivo File, subirlo
        if (values.payment_recipe_url instanceof File) {
          const paymentRecipeUrl = await uploadPaymentRecipe(values.payment_recipe_url);
          if (!paymentRecipeUrl) {
            toast.error('El recibo no se pudo subir');
            return;
          }
          // actualizar la inscripcion con el url del recibo
          const inscripcionData: Partial<Inscripcion> = {
            payments: [{
              payment_amount: 50,
              payment_method: 'yape',
              payment_recipe_url: paymentRecipeUrl,
              payment_checked: false,
            }],
          };

          const { error } = await supabase
            .from('inscripciones')
            .update(inscripcionData)
            .eq('id', data.id);
          if (error) {
            toast.error('El recibo no se pudo actualizar');
            return;
          }
        }
      }

      // El realtime se encargará de actualizar el estado
      // Pero mantenemos esto por si acaso el realtime no está activo
      if (data && !inscripcionesChannel) {
        toast.success('Inscripción creada correctamente');
        set({ inscripciones: [data, ...get().inscripciones] });
        set({ selectedInscripcion: data });
        return data;
      }
    } catch (error) {
      toast.error('La inscripción no se pudo crear');
      return null;
    }
  },

  updateInscripcion: async (values, id) => {
    try {
      const precios = usePreciosStore.getState().precios;
      const precio = precios.find(p => p.id === values.price_id);

      if (!precio) {
        toast.error('El precio no existe');
        return;
      }

      // 📝 Preparar datos para actualizar
      const inscripcionData: Partial<Inscripcion> = {
        name: values.name,
        dni: values.dni,
        age: values.age,
        height: values.height,
        is_under_18: values.is_under_18 || false,
        cellphone_number: values.cellphone_number || null,
        price_id: precio.id,
        price_name: precio.name,
        price_amount: precio.price,
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
      toast.error('La inscripción no se pudo cancelar');
    }
  },

  handleCheckInInscripcion: async (id) => {
    try {
      // Verificar que el ID sea válido
      if (!id) {
        toast.error('ID de inscripción no válido');
        return;
      }

      // Intentar buscar la inscripción en el estado local
      let inscripcionToCheckIn = get().inscripciones.find(i => i.id === id);

      // Si no está en el estado local, buscarla en la base de datos
      if (!inscripcionToCheckIn) {
        const { data: inscripcionDb, error: fetchError } = await supabase
          .from('inscripciones')
          .select()
          .eq('id', id)
          .single();

        if (fetchError || !inscripcionDb) {
          toast.error('Inscripción no encontrada');

          return;
        }

        inscripcionToCheckIn = inscripcionDb;
      }

      // Realizar la actualización
      const { data, error } = await supabase
        .from('inscripciones')
        .update({ check_in: !inscripcionToCheckIn?.check_in })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error de Supabase al realizar check-in:', error);
        throw error;
      }

      // Verificar que se recuperó la inscripción actualizada
      if (!data) {
        throw new Error('No se recibieron datos de la inscripción actualizada');
      }

      toast.success(data.check_in ? 'Check-in realizado correctamente' : 'Check-in cancelado correctamente');

      // Actualizar el estado local solo si no hay canal de realtime activo
      if (!inscripcionesChannel) {
        const inscripcionExisteEnEstado = get().inscripciones.some(i => i.id === id);

        if (inscripcionExisteEnEstado) {
          // Actualizar inscripción existente
          set({
            inscripciones: get().inscripciones.map(
              inscripcion => inscripcion.id === id ? data : inscripcion
            )
          });
        } else {
          // Agregar inscripción nueva al estado
          set({
            inscripciones: [...get().inscripciones, data]
          });
        }
      }

      return data;

    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error: ${error.message}`
          : 'El check-in no se pudo realizar'
      );
      throw error;
    }
  },

  createPayment: async (values: any, inscripcionId?: string) => {
    try {
      if (!inscripcionId) {
        toast.error('No se proporcionó una inscripción');
        return;
      }

      let paymentRecipeUrl = values.payment_recipe_url;

      // 📤 Si hay un archivo File, subirlo primero
      if (values.payment_recipe_url instanceof File) {
        paymentRecipeUrl = await uploadPaymentRecipe(values.payment_recipe_url);
        if (!paymentRecipeUrl) {
          toast.error('El recibo no se pudo subir');
          return;
        }
      }

      const inscripcion = get().inscripciones.find(i => i.id === inscripcionId);
      if (!inscripcion) {
        toast.error('Inscripción no encontrada');
        return;
      }

      const payments = inscripcion.payments || [];
      const newPayment = {
        id: uuidv4(),
        ...values,
        payment_recipe_url: paymentRecipeUrl,
      };

      const newPayments = [...payments, newPayment];

      const { data, error } = await supabase
        .from('inscripciones')
        .update({
          payments: newPayments,
        })
        .eq('id', inscripcionId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        set({
          inscripciones: get().inscripciones.map(
            inscripcion => inscripcion.id === inscripcionId ? data : inscripcion
          ),
          selectedInscripcion: data,
        });
        toast.success('Pago creado correctamente');

      }
    } catch (error) {
      toast.error('El pago no se pudo crear');
    }
  },

  updatePayment: async (values: any, paymentId: string, inscripcionId?: string) => {
    // eliminar ell reciepment anterior si hubiere y subir el nuevo si hubiere
    try {
      if (!inscripcionId) {
        toast.error('No se proporcionó una inscripción');
        return;
      }
      let paymentRecipeUrl = values.payment_recipe_url;


      // 📤 Si hay un nuevo archivo File, subirlo
      if (values.payment_recipe_url instanceof File) {
        // 🗑️ Obtener el pago actual para eliminar la imagen anterior
        const currentInscripcion = get().inscripciones.find(i => i.id === inscripcionId);
        const currentPayment = currentInscripcion?.payments?.find(p => p.id === paymentId);

        if (currentPayment?.payment_recipe_url) {
          await deletePaymentRecipe(currentPayment.payment_recipe_url);
        }

        paymentRecipeUrl = await uploadPaymentRecipe(values.payment_recipe_url);
        if (!paymentRecipeUrl) {
          return; // Ya se mostró el error en uploadPaymentRecipe
        }
      } else {
        paymentRecipeUrl = values.payment_recipe_url;
        const currentInscripcion = get().inscripciones.find(i => i.id === inscripcionId);
        const currentPayment = currentInscripcion?.payments?.find(p => p.id === paymentId);
        if (currentPayment?.payment_recipe_url) {
          await deletePaymentRecipe(currentPayment.payment_recipe_url);
        }
      }

      const updatedPayment = {
        id: paymentId,
        ...values,
        payment_recipe_url: paymentRecipeUrl,
      };

      const { data, error } = await supabase
        .from('inscripciones')
        .update({
          payments: get().inscripciones.find(i => i.id === inscripcionId)?.payments?.map(p => p.id === paymentId ? updatedPayment : p),
        })
        .eq('id', inscripcionId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        set({
          inscripciones: get().inscripciones.map(
            inscripcion => inscripcion.id === inscripcionId ? data : inscripcion
          ),
          selectedInscripcion: data,
        });
        toast.success('Pago actualizado correctamente');
      }
    } catch (error) {
      toast.error('El pago no se pudo actualizar');
    }
  },

  deletePayment: async (paymentId: string, inscripcionId?: string) => {
    // eliminar el reciepment si hubiere
    try {
      if (!inscripcionId) {
        toast.error('No se proporcionó una inscripción');
        return;
      }
      const inscripcion = get().inscripciones.find(i => i.id === inscripcionId);
      const payment = inscripcion?.payments?.find(p => p.id === paymentId);

      const { data, error } = await supabase
        .from('inscripciones')
        .update({
          payments: inscripcion?.payments?.filter(p => p.id !== paymentId),
        })
        .eq('id', inscripcionId)
        .select()
        .single();

      if (error) throw error;

      // 🗑️ Eliminar imagen asociada si existe
      if (payment?.payment_recipe_url) {
        await deletePaymentRecipe(payment?.payment_recipe_url);
      }

      if (data) {
        set({
          inscripciones: get().inscripciones.map(
            inscripcion => inscripcion.id === inscripcionId ? data : inscripcion
          ),
          selectedInscripcion: data,
        });
        toast.success('Pago eliminado correctamente');
      }
    } catch (error) {
      toast.error('El pago no se pudo eliminar');
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