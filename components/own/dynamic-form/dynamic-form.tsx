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

  const renderField = (fieldConfig: FieldConfig) => {
    return (
      <FormField
        key={fieldConfig.name}
        control={form.control}
        name={fieldConfig.name}
        render={({ field: formField }) => {
          switch (fieldConfig.type) {
            case 'textarea':
              return <FieldTextarea fieldConfig={fieldConfig} formField={formField} />
            case 'select':
              return <FieldSelect fieldConfig={fieldConfig} formField={formField} />
            case 'color':
              return <FieldColor fieldConfig={fieldConfig} formField={formField} />
            case 'checkbox':
              return <FieldCheckbox fieldConfig={fieldConfig} formField={formField} />
            case 'integer':
              return <FieldInteger fieldConfig={fieldConfig} formField={formField} />
            case 'password':
              return <FieldPassword fieldConfig={fieldConfig} formField={formField} />
            case 'date':
              return <FieldDatePicker fieldConfig={fieldConfig} formField={formField} />
            case 'email':
            case 'text':
            default:
              return <FieldText fieldConfig={fieldConfig} formField={formField} />
          }
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className={cn("w-full sm:min-w-md grid gap-2 grid-cols-1", className)} noValidate>
        {fields.map((field) => renderField(field))}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          className="w-full col-span-full"
        >
          {form.formState.isSubmitting ? 'Cargando...' : 'Guardar'}
        </Button>
      </form>
    </Form>
  )
}
