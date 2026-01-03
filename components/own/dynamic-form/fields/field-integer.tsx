import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldConfig } from "@/shared/types/ui.types";

interface FormFieldProps {
  fieldConfig: FieldConfig;
  formField: any;
}

export default function FieldInteger({ fieldConfig, formField }: FormFieldProps) {
  return (
    <FormItem className={fieldConfig.className}>
      <FormLabel>{fieldConfig.label} {fieldConfig.required && <span className="text-red-400">*</span>}</FormLabel>
      <FormControl>
        <Input
          type="number"
          step={1}
          inputMode="numeric"
          {...formField}
          value={formField.value ?? ""}
          onChange={(e) => {
            // Convertimos el valor a número entero si es posible
            const value = e.target.value;
            if (value === "") return formField.onChange("");

            // Solo aceptar dígitos numéricos
            if (/^\d+$/.test(value)) {
              formField.onChange(Number(value));
            }
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
