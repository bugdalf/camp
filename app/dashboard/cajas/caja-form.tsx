'use client'

import { DynamicForm } from "@/components/own/dynamic-form/dynamic-form";
import { Caja } from "@/shared/types/supabase.types";
import type { DialogHandlers, FieldConfig } from "@/shared/types/ui.types";
import { z } from "zod";

const cajaFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
});

interface CajaFormProps {
  dialogHandlers: DialogHandlers;
  onCreate: (data: Record<string, any>) => Promise<Caja | null>;
  onEdit: (data: Record<string, any>, id: string) => Promise<void>;
}

export function CajaForm({ dialogHandlers, onCreate, onEdit }: CajaFormProps) {
  const handleCreate = async (values: Record<string, any>): Promise<void> => {
    await onCreate(values);
    dialogHandlers.setOpenDialog(false);
  }

  const handleEdit = async (values: Record<string, any>): Promise<void> => {
    await onEdit(values, dialogHandlers.selectedItem.id);
    dialogHandlers.setOpenDialog(false);
  }

  // Configuración de formulario
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingresa el nombre para el precio'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: false,
      placeholder: 'Ingresa la descripción del precio',
    },
  ];

  return (
    <DynamicForm
      schema={cajaFormSchema}
      fields={fields}
      onSubmit={dialogHandlers.selectedItem ? handleEdit : handleCreate}
      selectedItem={dialogHandlers.selectedItem}
      className='w-sm px-2 h-fit'
    />
  )
}