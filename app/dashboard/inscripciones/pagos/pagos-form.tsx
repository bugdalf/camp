'use client'

import { DynamicForm } from "@/components/own/dynamic-form/dynamic-form";
import { useAuthStore } from "@/lib/store/auth.store";
import { useCajasStore } from "@/lib/store/cajas.store";
import { Inscripcion } from "@/shared/types/supabase.types";
import type { DialogHandlers, FieldConfig } from "@/shared/types/ui.types";
import { useMemo } from "react";
import { z } from "zod";

const pagosFormSchema = z.object({
  payment_amount: z.number().min(0, 'El precio es requerido'),
  payment_method: z.enum(['yape', 'efectivo']),
  caja_id: z.string().optional(),
  payment_recipe_url: z.union([
    z.instanceof(File),
    z.string(),
    z.null(),
    z.undefined()
  ]).optional().nullable(),
  payment_checked: z.boolean().default(false),
});

interface PagosFormProps {
  dialogHandlers: DialogHandlers;
  selectedInscripcion: Inscripcion | null;
  onCreate: (data: Record<string, any>, inscripcionId?: string) => Promise<void>;
  onEdit: (data: Record<string, any>, paymentId: string, inscripcionId?: string) => Promise<void>;
}

export function PagosForm({ dialogHandlers, selectedInscripcion, onCreate, onEdit }: PagosFormProps) {
  const { user } = useAuthStore();
  const { cajas } = useCajasStore();

  const cajasOptions = useMemo(() => {
    return cajas.map((caja) => ({
      label: caja.name || '',
      value: caja.id || '',
    }));
  }, [cajas]);

  const handleCreate = async (values: Record<string, any>): Promise<void> => {
    const valuesToCreate = {
      ...values,
      register_by: user?.email,
      caja_id: values.caja_id || null,
      caja_name: cajas.find((caja) => caja.id === values.caja_id)?.name || null,
      payment_checked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    await onCreate(valuesToCreate, selectedInscripcion?.id);
    dialogHandlers.setOpenDialog(false);
  }

  const handleEdit = async (values: Record<string, any>): Promise<void> => {
    const valuesToEdit = {
      ...values,
      updated_by: user?.email,
      caja_id: values.caja_id || null,
      caja_name: cajas.find((caja) => caja.id === values.caja_id)?.name || null,
      updated_at: new Date().toISOString(),
    }
    await onEdit(valuesToEdit, dialogHandlers.selectedItem.id, selectedInscripcion?.id);
    dialogHandlers.setOpenDialog(false);
  }

  // Configuración de formulario
  const fields: FieldConfig[] = [
    {
      name: 'payment_amount',
      label: 'Monto',
      type: 'integer',
      required: true,
      placeholder: 'Ingresa el monto del pago',
      inputMode: 'numeric',
      pattern: '[0-9]*',
      maxLength: 8,
    },
    {
      name: 'payment_method',
      label: 'Método de pago',
      type: 'select',
      required: true,
      className: 'col-span-2',
      options: [
        { label: 'Yape', value: 'yape' },
        { label: 'Efectivo', value: 'efectivo' }
      ]
    },
    {
      name: 'caja_id',
      label: 'Caja',
      type: 'select',
      required: true,
      className: 'col-span-2',
      options: cajasOptions
    },
    {
      name: 'payment_recipe_url',
      label: 'Comprobante de pago (imagen)',
      type: 'image',
      required: false,
      className: 'col-span-2',
      accept: 'image/*',
      helpText: 'Sube una captura de tu comprobante de pago'
    },
    {
      name: 'payment_checked',
      label: 'Pago verificado (solo admin)',
      type: 'checkbox',
      required: false,
      className: 'col-span-2',
      defaultValue: false
    }
  ];

  return (
    <DynamicForm
      schema={pagosFormSchema}
      fields={fields}
      onSubmit={dialogHandlers.selectedItem ? handleEdit : handleCreate}
      selectedItem={dialogHandlers.selectedItem}
      className='w-full px-2'
    />
  )
}