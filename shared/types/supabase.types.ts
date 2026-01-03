export type Inscripcion = {
  id?: string;
  name?: string;
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