'use client'

import { DynamicForm } from "@/components/own/dynamic-form/dynamic-form";
import type { DialogHandlers, FieldConfig } from "@/shared/types/ui.types";
import { z } from "zod";

const inscripcionesFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  age: z.number().min(1, 'La edad debe ser mayor a 0').max(120, 'Edad inválida'),
  is_under_18: z.boolean().default(false),
  cellphone_number: z.string().min(9, 'Número inválido').optional(),
  payment_method: z.enum(['yape', 'efectivo']),
  payment_recipe_url: z.union([
    z.instanceof(File),
    z.string(),
    z.undefined()
  ]).optional(),
  payment_checked: z.boolean().default(false),
  parent_name: z.string().optional(),
  parent_cellphone_number: z.string().optional(),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  }),
}).superRefine((data, ctx) => {
  // Validar campos del padre si es menor de 18
  if (data.is_under_18) {
    if (!data.parent_name || data.parent_name.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre del padre/tutor es requerido para menores de 18 años',
        path: ['parent_name'],
      });
    }
    if (!data.parent_cellphone_number || data.parent_cellphone_number.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El número del padre/tutor es requerido para menores de 18 años',
        path: ['parent_cellphone_number'],
      });
    }
  }
});

interface InscripcionesFormProps {
  dialogHandlers: DialogHandlers;
  onCreate: (data: Record<string, any>) => Promise<void>;
  onEdit: (data: Record<string, any>, id: string) => Promise<void>;
}

export function InscripcionesForm({ dialogHandlers, onCreate, onEdit }: InscripcionesFormProps) {
  const handleCreate = async (values: Record<string, any>): Promise<void> => {
    await onCreate(values);
    dialogHandlers.setOpenDialog(false);
  }

  const handleEdit = async (values: Record<string, any>): Promise<void> => {
    await onEdit(values, dialogHandlers.selectedItem.id);
    dialogHandlers.setOpenDialog(false);
  }

  // 🎯 Función para manejar cambio de edad
  const handleAgeChange = (age: number, setValue: any, getValues: any) => {
    const isUnder18 = age < 18;
    setValue('is_under_18', isUnder18, { shouldValidate: true });

    // Si pasa a ser mayor de 18, limpiar campos del padre
    if (!isUnder18) {
      setValue('parent_name', '', { shouldValidate: true });
      setValue('parent_cellphone_number', '', { shouldValidate: true });
    }
  }

  // Configuración de formulario
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre completo',
      type: 'text',
      required: true,
      className: 'col-span-2',
      placeholder: 'Ingresa tu nombre completo'
    },
    {
      name: 'cellphone_number',
      label: 'Número de celular',
      type: 'text',
      required: false,
      className: 'col-span-2',
      placeholder: '987654321'
    },
    {
      name: 'age',
      label: 'Edad',
      type: 'integer',
      required: true,
      className: 'col-span-1',
      placeholder: 'Ej: 25',
      onChange: handleAgeChange // 🎯 Añadir handler
    },
    {
      name: 'is_under_18',
      label: '¿Es menor de 18 años?',
      type: 'checkbox',
      required: false,
      className: 'col-span-1 items-end border-none',
      defaultValue: false,
      disabled: true // 🔒 Deshabilitar porque se calcula automáticamente
    },
    {
      name: 'parent_name',
      label: 'Nombre del padre/tutor',
      type: 'text',
      required: true,
      className: 'col-span-2',
      placeholder: 'Requerido si es menor de 18 años',
      dependsOn: { field: 'is_under_18', value: true } // 👁️ Solo visible si es menor
    },
    {
      name: 'parent_cellphone_number',
      label: 'Celular del padre/tutor',
      type: 'text',
      required: true,
      className: 'col-span-2',
      placeholder: 'Requerido si es menor de 18 años',
      dependsOn: { field: 'is_under_18', value: true } // 👁️ Solo visible si es menor
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
    },
    {
      name: 'terms_accepted',
      label: 'Acepto los términos y condiciones',
      type: 'checkbox',
      required: true,
      className: 'col-span-2',
      defaultValue: false
    },
  ];

  return (
    <DynamicForm
      schema={inscripcionesFormSchema}
      fields={fields}
      onSubmit={dialogHandlers.selectedItem ? handleEdit : handleCreate}
      selectedItem={dialogHandlers.selectedItem}
      className='grid-cols-2'
    />
  )
}