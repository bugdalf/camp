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
  created_at?: string;
  updated_at?: string;
}