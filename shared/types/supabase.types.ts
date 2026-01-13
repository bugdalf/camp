export type Inscripcion = {
  id?: string;
  name?: string;
  dni?: string;
  age?: number;
  is_under_18?: boolean;
  cellphone_number?: string;
  // pagos y precio cobrado
  price_id?: string;
  price_amount?: number;
  price_name?: string;
  payments?: Pago[];
  payment_completed?: boolean;

  parent_name?: string;
  parent_cellphone_number?: string;
  terms_accepted?: boolean;
  is_active?: boolean;
  register_by?: string; // quien registro la inscripcion
  check_in?: boolean;
  height?: number;

  shirt_size?: 's' | 'm' | 'l' | 'xl';
  gender?: 'varon' | 'mujer';
  observations?: string;
  created_at?: string;
  updated_at?: string;
}

export type Voluntario = {
  id?: string;
  name?: string;
  dni?: string;
  commission?: 'cocina' | 'limpieza' | 'produccion';
  age?: number;
  is_under_18?: boolean;
  cellphone_number?: string;
  payment_method?: 'yape' | 'efectivo';
  payment_recipe_url?: string;
  payment_checked?: boolean;
  parent_name?: string;
  parent_cellphone_number?: string;
  terms_accepted?: boolean;
  is_active?: boolean;
  register_by?: string; // quien registro la inscripcion
  check_in?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type Precio = {
  id?: string;
  name?: string;
  price?: number;
  description?: string;
  default?: boolean;
  created_at?: string;
  updated_at?: string;
}

// este es el json
export type Pago = {
  id?: string;
  payment_amount?: number;
  payment_method?: 'yape' | 'efectivo';
  payment_recipe_url?: string;
  payment_checked?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE';

export interface InscripcionAudit {
  id: string;
  inscripcion_id: string;
  action: AuditAction;
  user_id: string | null;
  user_email: string | null;
  changed_at: string;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  changed_fields: string[] | null;
  ip_address: string | null;
  user_agent: string | null;
}

export interface VoluntarioAudit {
  id: string;
  voluntario_id: string;
  action: AuditAction;
  user_id: string | null;
  user_email: string | null;
  changed_at: string;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  changed_fields: string[] | null;
  ip_address: string | null;
  user_agent: string | null;
}

export interface AuditLogView {
  id: string;
  inscripcion_id: string;
  inscripcion_name: string | null;
  action: AuditAction;
  user_email: string | null;
  changed_at: string;
  changed_fields: string[] | null;
  changes_detail: Record<string, { old: any; new: any }> | null;
}

export interface AuditFilters {
  inscripcionId?: string;
  userId?: string;
  action?: AuditAction;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

