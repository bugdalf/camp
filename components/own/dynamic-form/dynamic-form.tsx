'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import type { FormConfig, FieldConfig } from '@/shared/types/ui.types'
import FieldTextarea from './fields/field-textarea'
import FieldSelect from './fields/field-select'
import FieldCheckbox from './fields/field-checkbox'
import FieldText from './fields/field-text'
import FieldInteger from './fields/field-integer'
import { cn } from '@/lib/utils'
import { getDefaultValueForField } from './get-default-values'
import FieldPassword from './fields/field-password'
import FieldDatePicker from './fields/field-date-picker'
import FieldColor from './fields/field-color'
import FieldImage from './fields/field-image'

export function DynamicForm({
  fields,
  schema,
  onSubmit,
  selectedItem = null,
  className
}: FormConfig) {

  const defaultValues = fields.reduce((acc, field) => {
    acc[field.name] = getDefaultValueForField(field, selectedItem);
    return acc;
  }, {} as Record<string, any>);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: defaultValues,
  })

  const onSubmitHandler = async (data: Record<string, any>) => {
    await onSubmit(data)
  }

  // 👁️ Función para verificar si un campo debe mostrarse
  const shouldShowField = (fieldConfig: FieldConfig): boolean => {
    if (!fieldConfig.dependsOn) return true;

    const dependentValue = form.watch(fieldConfig.dependsOn.field);
    return dependentValue === fieldConfig.dependsOn.value;
  }

  const renderField = (fieldConfig: FieldConfig) => {
    // 👁️ No renderizar si el campo no debe mostrarse
    if (!shouldShowField(fieldConfig)) {
      return null;
    }

    return (
      <FormField
        key={fieldConfig.name}
        control={form.control}
        name={fieldConfig.name}
        render={({ field: formField }) => {
          // 🎯 Wrapper para onChange personalizado
          const handleChange = (value: any) => {
            formField.onChange(value);

            // Ejecutar onChange personalizado si existe
            if (fieldConfig.onChange) {
              fieldConfig.onChange(value, form.setValue, form.getValues);
            }
          };

          const enhancedFormField = {
            ...formField,
            onChange: handleChange,
            disabled: fieldConfig.disabled || formField.disabled
          };

          switch (fieldConfig.type) {
            case 'textarea':
              return <FieldTextarea fieldConfig={fieldConfig} formField={enhancedFormField} />
            case 'select':
              return <FieldSelect fieldConfig={fieldConfig} formField={enhancedFormField} />
            case 'color':
              return <FieldColor fieldConfig={fieldConfig} formField={enhancedFormField} />
            case 'checkbox':
              return <FieldCheckbox fieldConfig={fieldConfig} formField={enhancedFormField} />
            case 'integer':
              return <FieldInteger fieldConfig={fieldConfig} formField={enhancedFormField} />
            case 'password':
              return <FieldPassword fieldConfig={fieldConfig} formField={enhancedFormField} />
            case 'date':
              return <FieldDatePicker fieldConfig={fieldConfig} formField={enhancedFormField} />
            case 'image':
              return <FieldImage fieldConfig={fieldConfig} formField={enhancedFormField} />
            case 'email':
            case 'text':
            default:
              return <FieldText fieldConfig={fieldConfig} formField={enhancedFormField} />
          }
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className={cn("w-full sm:min-w-md grid gap-2 grid-cols-1 h-full overflow-auto px-1 relative", className)} noValidate>
        {fields.map((field) => renderField(field))}

        <div className="w-full col-span-full sticky bottom-0 bg-card">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            className="w-full col-span-full"
          >
            {form.formState.isSubmitting ? 'Cargando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}