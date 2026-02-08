'use client'

import { DynamicForm } from "@/components/own/dynamic-form/dynamic-form";
import { Button } from "@/components/ui/button";
import { isValidPeruDni } from "@/lib/utils-functions/dni-validator";
import type { FieldConfig } from "@/shared/types/ui.types";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const autovoluntarioFormSchema = z.object({
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
        .max(80, 'La edad no puede superar 30 años')
    ),
  gender: z.enum(['varon', 'mujer']),
  shirt_size: z.enum(['s', 'm', 'l', 'xl']),
  commission: z.enum(['logistica', 'recepcion', 'programacion-actividades', 'sonido-luces', 'publicidad', 'alimentacion-limpieza', 'finanzas', 'atencion-pastores', 'jueces', 'contenido-digital', 'lideres-equipo', 'dinamicas-souvenires']),
  is_under_18: z.boolean().default(false),
  cellphone_number: z
    .string()
    .min(1, "El número de celular es requerido")
    .regex(/^\d{9}$/, "El número debe tener exactamente 9 dígitos numéricos"),
  payment_recipe_url: z
    .union([
      z.instanceof(File),
      z.string(),
      z.undefined(),
    ])
    .refine((val) => {
      if (!val) return false
      if (val instanceof File) return true
      if (typeof val === 'string') return val.trim().length > 0
      return false
    }, {
      message: 'El comprobante de pago es obligatorio',
    }),
  parent_name: z.string().optional(),
  parent_cellphone_number: z
    .string()
    .optional()
    .nullable()
    .transform(val => val || undefined),
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

interface AutovoluntarioFormProps {
  onCreate: (data: Record<string, any>) => Promise<void>;
  setStep: (step: number) => void;
}

export function AutovoluntarioForm({ onCreate, setStep }: AutovoluntarioFormProps) {
  const handleCreate = async (values: Record<string, any>): Promise<void> => {
    await onCreate(values);
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

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.info("Número copiado al portapapeles");
  }

  // Configuración de formulario
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre completo',
      type: 'text',
      required: true,
      className: 'col-span-4',
      placeholder: 'Ingresa el nombre completo'
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
      ],
      placeholder: 'Selecciona una talla'
    },
    {
      name: 'commission',
      label: 'Comisión',
      type: 'select',
      required: true,
      className: 'col-span-4',
      placeholder: 'Selecciona una comisión',
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
        { label: 'Dinámicas y Souvenires', value: 'dinamicas-souvenires' }
      ]
    },
    {
      name: 'is_under_18',
      label: '¿Es menor de 18 años?',
      type: 'checkbox',
      required: false,
      className: 'col-span-1 items-end border-none hidden',
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
      name: 'payment_recipe_url',
      label: 'Comprobante de pago (imagen)',
      type: 'image',
      required: true,
      className: 'col-span-4',
      accept: 'image/*',
      helpText: 'Sube una captura de tu comprobante de pago'
    },
    {
      name: 'terms_accepted',
      label: 'Acepto los términos y condiciones',
      type: 'checkbox',
      required: true,
      className: 'col-span-4',
      defaultValue: false
    },
  ];

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <div className="flex w-full justify-center gap-2">
        <div onClick={() => handleCopyNumber("950569436")} className="flex flex-col items-center gap-px bg-slate-100 px-2 py-2 rounded border border-gray-200 cursor-pointer">
          <figure className="w-24 h-24">
            <img src="/qrs/plin.jpg" alt="" className="w-full h-auto object-contain" />
          </figure>
          <div>José Mamani - Plin</div>
          <div className="flex gap-2 items-center">950569436 <CopyIcon /></div>
        </div>
        <div onClick={() => handleCopyNumber("956890060")} className="flex flex-col items-center gap-px bg-slate-100 px-2 py-2 rounded border border-gray-200 cursor-pointer">
          <figure className="w-24 h-24">
            <img src="/qrs/yape.jpg" alt="" className="w-full h-auto object-contain" />
          </figure>
          <div>Victor Atamari - Yape</div>
          <div className="flex gap-2 items-center">956890060 <CopyIcon /></div>
        </div>
      </div>
      <DynamicForm
        buttonLabel="Inscribirse"
        buttonSize="cta"
        buttonVariant="cta"
        schema={autovoluntarioFormSchema}
        fields={fields}
        onSubmit={handleCreate}
        selectedItem={null}
        className='grid-cols-4 px-2'
      />
      <Button onClick={() => setStep(1)} variant="outline" className="w-fit">Volver</Button>
    </div>
  )
}