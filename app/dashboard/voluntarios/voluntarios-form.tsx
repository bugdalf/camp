'use client'

import { DynamicForm } from "@/components/own/dynamic-form/dynamic-form";
import { useAuthStore } from "@/lib/store/auth.store";
import { useCajasStore } from "@/lib/store/cajas.store";
import { isValidPeruDni } from "@/lib/utils-functions/dni-validator";
import { Voluntario } from "@/shared/types/supabase.types";
import type { DialogHandlers, FieldConfig } from "@/shared/types/ui.types";
import { useMemo } from "react";
import { z } from "zod";

const voluntariosFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  dni: z
    .string()
    .trim()
    .refine(isValidPeruDni, {
      message: 'DNI inválido (debe tener 8 dígitos)',
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
  gender: z.enum(['varon', 'mujer']),
  shirt_size: z.enum(['s', 'm', 'l', 'xl']),
  commission: z.enum(['logistica', 'recepcion', 'programacion-actividades', 'sonido-luces', 'publicidad', 'alimentacion-limpieza', 'finanzas', 'atencion-pastores', 'jueces', 'contenido-digital', 'lideres-equipo', 'dinamicas-souvenires', 'salud']),
  is_under_18: z.boolean().default(false),
  cellphone_number: z
    .string()
    .min(1, "El número de celular es requerido")
    .regex(/^\d{9}$/, "El número debe tener exactamente 9 dígitos numéricos"),
  payment_method: z.enum(['yape', 'efectivo']),
  caja_id: z.string().optional().nullable().transform(val => val || undefined),
  payment_recipe_url: z.union([
    z.instanceof(File),
    z.string(),
    z.undefined()
  ]).optional(),
  payment_checked: z.boolean().default(false),
  parent_name: z.string().optional().nullable().transform(val => val || undefined),
  parent_cellphone_number: z
    .string()
    .optional()
    .nullable()
    .transform(val => val || undefined),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  }),
  observations: z.string().optional().nullable().transform(val => val || undefined),
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

interface VoluntariosFormProps {
  dialogHandlers: DialogHandlers;
  onCreate: (data: Record<string, any>) => Promise<Voluntario | null>;
  onEdit: (data: Record<string, any>, id: string) => Promise<void>;
}

export function VoluntariosForm({ dialogHandlers, onCreate, onEdit }: VoluntariosFormProps) {
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
      caja_name: cajas.find(caja => caja.id === values.caja_id)?.name || '',
    }

    await onCreate(valuesToCreate);
    dialogHandlers.setOpenDialog(false);
  }

  const handleEdit = async (values: Record<string, any>): Promise<void> => {
    const valuesToEdit = {
      ...values,
      caja_name: cajas.find(caja => caja.id === values.caja_id)?.name || '',
    }
    await onEdit(valuesToEdit, dialogHandlers.selectedItem.id);
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
      label: 'Nombre completo del voluntario',
      type: 'text',
      required: true,
      className: 'col-span-4',
      placeholder: 'Ingresa el nombre completo del voluntario'
    },
    {
      name: 'dni',
      label: 'DNI',
      type: 'text',
      required: true,
      className: 'col-span-4',
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
      className: 'col-span-2',
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
      className: 'col-span-2',
      placeholder: 'Ej: 25',
      onChange: handleAgeChange // 🎯 Añadir handler
    },
    {
      name: 'gender',
      label: 'Género',
      type: 'radio',
      required: true,
      className: 'col-span-4',
      options: [
        { label: 'Masculino', value: 'varon' },
        { label: 'Femenino', value: 'mujer' }
      ]
    },
    {
      name: 'shirt_size',
      label: 'Talla de polo',
      type: 'select',
      required: true,
      className: 'col-span-4',
      options: [
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' }
      ]
    },
    {
      name: 'commission',
      label: 'Comisión',
      type: 'select',
      required: true,
      className: 'col-span-4',
      options: [
        { label: 'Logística', value: 'logistica' },
        { label: 'Recepción', value: 'recepcion' },
        { label: 'Programación y actividades', value: 'programacion-actividades' },
        { label: 'Sonido y luces', value: 'sonido-luces' },
        { label: 'Publicidad', value: 'publicidad' },
        { label: 'Alimentación y limpieza', value: 'alimentacion-limpieza' },
        { label: 'Finanzas', value: 'finanzas' },
        { label: 'Atención de pastores', value: 'atencion-pastores' },
        { label: 'Jueces', value: 'jueces' },
        { label: 'Contenido digital', value: 'contenido-digital' },
        { label: 'Líderes de equipo', value: 'lideres-equipo' },
        { label: 'Dinámicas y Souvenires', value: 'dinamicas-souvenires' },
        { label: 'Salud', value: 'salud' },
      ]
    },
    {
      name: 'is_under_18',
      label: '¿Es menor de 18 años?',
      type: 'checkbox',
      required: false,
      className: 'col-span-4 items-end border-none hidden',
      defaultValue: false,
      disabled: true // 🔒 Deshabilitar porque se calcula automáticamente
    },
    {
      name: 'parent_name',
      label: 'Nombre del padre/tutor',
      type: 'text',
      required: true,
      className: 'col-span-4',
      placeholder: 'Requerido si es menor de 18 años',
      dependsOn: { field: 'is_under_18', value: true } // 👁️ Solo visible si es menor
    },
    {
      name: 'parent_cellphone_number',
      label: 'Celular del padre/tutor',
      type: 'text',
      required: true,
      className: 'col-span-4',
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
      className: 'col-span-4',
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
      className: 'col-span-4',
      options: cajasOptions
    },
    {
      name: 'payment_recipe_url',
      label: 'Comprobante de pago (imagen)',
      type: 'image',
      required: false,
      className: 'col-span-4',
      accept: 'image/*',
      helpText: 'Sube una captura de tu comprobante de pago'
    },
    {
      name: 'payment_checked',
      label: 'Pago verificado (solo admin)',
      type: 'checkbox',
      required: false,
      className: 'col-span-4',
      defaultValue: false
    },
    {
      name: 'terms_accepted',
      label: 'Acepto los términos y condiciones',
      type: 'checkbox',
      required: true,
      className: 'col-span-4',
      defaultValue: false
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
      className: 'col-span-4',
      placeholder: 'Anotar aqui incidencias',
    }
  ];

  return (
    <DynamicForm
      schema={voluntariosFormSchema}
      fields={fields}
      onSubmit={dialogHandlers.selectedItem ? handleEdit : handleCreate}
      selectedItem={dialogHandlers.selectedItem}
      className='w-full px-2 grid-cols-4'
    />
  )
}