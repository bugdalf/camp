'use client'

import { DynamicForm } from "@/components/own/dynamic-form/dynamic-form";
import { useAuthStore } from "@/lib/store/auth.store";
import { isValidPeruDni } from "@/lib/utils-functions/dni-validator";
import { Inscripcion } from "@/shared/types/supabase.types";
import type { DialogHandlers, FieldConfig } from "@/shared/types/ui.types";
import { z } from "zod";

const inscripcionesFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  dni: z
    .string()
    .trim()
    .refine(isValidPeruDni, {
      message: 'DNI inválido (debe tener 8 dígitos y no empezar con 0)',
    }),
  age: z
    .union([z.number(), z.string()])
    .transform((val) => {
      // Si es string, convertir a número
      if (typeof val === 'string') {
        // Si está vacío, retornar null
        if (val.trim() === '') return null;
        const numValue = parseInt(val, 10);
        return isNaN(numValue) ? null : numValue;
      }
      return val;
    })
    .pipe(
      z.number({
        required_error: 'La edad es requerida',
        invalid_type_error: 'La edad debe ser un número válido'
      })
        .min(14, 'La edad mínima es de 14 años')
        .max(30, 'La edad no puede superar 30 años')
    ),
  height: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        const numValue = parseInt(val.replace(/[^\d]/g, ''), 10);
        return isNaN(numValue) ? null : numValue;
      }
      return val;
    })
    .refine((val) => val !== null && val >= 50 && val <= 250, {
      message: 'La estatura debe estar entre 50cm y 250cm'
    })
    .transform((val) => val as number),
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
  onCreate: (data: Record<string, any>) => Promise<Inscripcion | null>;
  onEdit: (data: Record<string, any>, id: string) => Promise<void>;
}

export function InscripcionesForm({ dialogHandlers, onCreate, onEdit }: InscripcionesFormProps) {
  const { user } = useAuthStore();
  const handleCreate = async (values: Record<string, any>): Promise<void> => {
    const valuesToCreate = {
      ...values,
      register_by: user?.email
    }
    await onCreate(valuesToCreate);
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
      name: 'dni',
      label: 'DNI',
      type: 'text',
      required: true,
      className: 'col-span-1',
      placeholder: 'Ingresa tu DNI',
      inputMode: 'numeric',
      pattern: '[0-9]*',
      maxLength: 8,
    },
    {
      name: 'cellphone_number',
      label: 'Número de celular',
      type: 'text',
      required: false,
      className: 'col-span-1',
      placeholder: '987654321',
      inputMode: 'numeric',
      pattern: '[0-9]*',
      maxLength: 9,
    },
    {
      name: 'age',
      label: 'Edad',
      type: 'integer',
      required: true,
      className: 'col-span-1',
      placeholder: 'Ej: 25',
      onChange: handleAgeChange
    },
    {
      name: 'height',
      label: 'Estatura',
      type: 'height',
      required: true,
      className: 'col-span-1',
      placeholder: 'Ej: 170',
      inputMode: 'numeric',
      pattern: '[0-9]*',
      maxLength: 3,
    },
    {
      name: 'is_under_18',
      label: '¿Es menor de 18 años?',
      type: 'checkbox',
      required: false,
      className: 'col-span-1 items-end border-none hidden',
      defaultValue: false,
      disabled: true
    },
    {
      name: 'parent_name',
      label: 'Nombre del padre/tutor',
      type: 'text',
      required: true,
      className: 'col-span-2',
      placeholder: 'Requerido si es menor de 18 años',
      dependsOn: { field: 'is_under_18', value: true }
    },
    {
      name: 'parent_cellphone_number',
      label: 'Celular del padre/tutor',
      type: 'text',
      required: true,
      className: 'col-span-2',
      placeholder: '987654321',
      inputMode: 'numeric',
      pattern: '[0-9]*',
      maxLength: 9,
      dependsOn: { field: 'is_under_18', value: true },
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
      className='grid-cols-2 px-2'
    />
  )
}