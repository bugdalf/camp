import type { LucideIcon } from "lucide-react";

export type DialogHandlers = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openDialogDelete: boolean;
  setOpenDialogDelete: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: any;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
};

export type FieldType = 'text' | 'email' | 'password' | 'integer' | 'textarea' | 'select' | 'checkbox' | 'date' | 'color'

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  options?: Array<{ label: string; value: string }>
  defaultValue?: any
  required: boolean,
  className?: string
}

export interface FormConfig {
  fields: FieldConfig[]
  schema: any
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  className?: string
  selectedItem?: Record<string, any> | null
}

export interface HandlerResponse {
  success: boolean;
  message?: string;
}

export interface ExtraAction {
  label: string;
  handler: (item: any) => void;
  icon: LucideIcon;
}