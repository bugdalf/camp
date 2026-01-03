import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { FieldConfig } from "@/shared/types/ui.types";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  fieldConfig: FieldConfig,
  formField: any,
}

export default function FieldCheckbox({ fieldConfig, formField }: FormFieldProps) {
  const value = formField.value !== undefined && formField.value !== null
    ? formField.value
    : fieldConfig.defaultValue || false; // <- valor por defecto
  
  return (
    <FormItem className={cn("flex flex-row items-end space-x-3", fieldConfig.className)}>
      <FormControl>
        <Checkbox
          checked={value}
          onCheckedChange={formField.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>{fieldConfig.label} {fieldConfig.required && <span className="text-red-400">*</span>}</FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  );
}