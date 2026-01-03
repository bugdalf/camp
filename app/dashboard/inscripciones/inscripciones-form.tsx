
import { DynamicForm } from "@/components/own/dynamic-form/dynamic-form";
import type { DialogHandlers, FieldConfig } from "@/shared/types/ui.types";
import { z } from "zod";

const inscripcionesFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  order: z.number().min(1, 'El orden es requerido'),
  color: z.string().min(1, 'El color es requerido'),
})
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

  // configuracion de formulario
  const fields: FieldConfig[] = [
    { name: 'name', label: 'Nombre', type: 'text', required: true, className: 'col-span-2' },
    { name: 'order', label: 'Orden', type: 'integer', required: true, className: 'col-span-2' },
    {
      name: 'color', label: 'Color', type: 'color', required: true, defaultValue: "#3b82f6", className: 'col-span-2', options: [
        { label: "Rojo", value: "#ef4444" },
        { label: "Rojo Oscuro", value: "#dc2626" },
        { label: "Naranja", value: "#f97316" },
        { label: "Ámbar", value: "#f59e0b" },
        { label: "Amarillo", value: "#eab308" },
        { label: "Lima", value: "#84cc16" },
        { label: "Verde", value: "#10b981" },
        { label: "Esmeralda", value: "#059669" },
        { label: "Turquesa", value: "#14b8a6" },
        { label: "Cian", value: "#06b6d4" },
        { label: "Azul Cielo", value: "#0ea5e9" },
        { label: "Azul", value: "#3b82f6" },
        { label: "Índigo", value: "#6366f1" },
        { label: "Violeta", value: "#8b5cf6" },
        { label: "Púrpura", value: "#a855f7" },
        { label: "Fucsia", value: "#d946ef" },
        { label: "Rosa", value: "#ec4899" },
        { label: "Rosa Intenso", value: "#f43f5e" },
        { label: "Gris", value: "#6b7280" },
        { label: "Negro", value: "#000000" },
      ],
    },
  ]

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