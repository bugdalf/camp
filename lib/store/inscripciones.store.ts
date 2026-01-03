import { create } from "zustand"
import { toast } from "sonner"
import { createClient } from "../supabase/client"
import { Inscripcion } from "@/shared/types/supabase.types";

let inscripcionesChannel: ReturnType<typeof supabase.channel> | null = null
const supabase = createClient();

type InscripcionesStore = {
  inscripciones: Inscripcion[]
  fetchInscripciones: () => Promise<void>
  createInscripcion: (values: Record<string, Inscripcion>) => Promise<void>
  updateInscripcion: (values: Record<string, Inscripcion>, id: string) => Promise<void>
  deleteInscripcion: (id: string) => Promise<void>

  subscribeToInscripciones: () => void
  unsubscribeFromInscripciones: () => void
}

export const useInscripcionesStore = create<InscripcionesStore>((set, get) => ({
  inscripciones: [],

  fetchInscripciones: async () => {
    const { data } = await supabase.from('inscripciones').select('*').order('updated_at');
    set({ inscripciones: data ?? [] });
  },

  createInscripcion: async (values) => {
    const { data } = await supabase.from('inscripciones').insert(values).select().single();

    if (data) {
      toast.success('Inscripcion creada correctamente')
    } else {
      toast.error('La inscripcion no se pudo crear')
    }

    // El realtime se encargará de actualizar el estado
    // Pero mantenemos esto por si acaso el realtime no está activo
    if (data && !inscripcionesChannel) {
      set({ inscripciones: [...get().inscripciones, data] })
    }
  },

  updateInscripcion: async (values, id) => {
    const { data } = await supabase
      .from('inscripciones')
      .update({ ...values })
      .eq('id', id)
      .select()
      .single()

    if (data) {
      toast.success('Inscripcion actualizada correctamente')
    } else {
      toast.error('La inscripcion no se pudo actualizar')
    }

    // El realtime se encargará de actualizar el estado
    if (data && !inscripcionesChannel) {
      set({ inscripciones: get().inscripciones.map(inscripcion => inscripcion.id === id ? data : inscripcion) })
    }
  },

  deleteInscripcion: async (id) => {
    const { data } = await supabase
      .from('inscripciones')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (data) {
      toast.success('Inscripcion eliminada correctamente')
    } else {
      toast.error('La inscripcion no se pudo eliminar')
    }

    // El realtime se encargará de actualizar el estado
    if (data && !inscripcionesChannel) {
      set({ inscripciones: get().inscripciones.filter(inscripcion => inscripcion.id !== id) })
    }
  },

  subscribeToInscripciones: () => {
    inscripcionesChannel = supabase
      .channel('custom-all')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'inscripciones',
      }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          set({ inscripciones: [...get().inscripciones, payload.new] })
        } else if (payload.eventType === 'UPDATE') {
          set({ inscripciones: get().inscripciones.map(inscripcion => inscripcion.id === payload.new.id ? payload.new : inscripcion) })
        } else if (payload.eventType === 'DELETE') {
          set({ inscripciones: get().inscripciones.filter(inscripcion => inscripcion.id !== payload.old.id) })
        }
      })
      .subscribe()
  },

  unsubscribeFromInscripciones: () => {
    if (inscripcionesChannel) {
      inscripcionesChannel.unsubscribe()
      inscripcionesChannel = null
    }
  },
}))