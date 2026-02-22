import { toast } from 'sonner';
import { createClient } from '../supabase/client';

const supabase = createClient();

export const exportInscripcionesCSV = async () => {
  try {
    const { data, error } = await supabase
      .from('inscripciones')
      .select(`
        id, 
        name, 
        age, 
        is_under_18, 
        cellphone_number, 
        parent_name, 
        parent_cellphone_number, 
        terms_accepted, 
        is_active, 
        register_by, 
        dni, 
        check_in, 
        price_name, 
        price_amount, 
        shirt_size, 
        gender,
        height,
        observations
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      toast.error('No hay inscripciones para exportar');
      return;
    }

    const headers = [
      'ID',
      'Nombre',
      'Edad',
      'Menor de 18',
      'Número de Celular',
      'Nombre del Padre/Tutor',
      'Acepto Terminos',
      'Activo',
      'Registrado por',
      'DNI',
      'Check In',
      'Precio',
      'Monto',
      'Talle de Camiseta',
      'Género',
      'Estatura',
      'Observaciones'
    ];

    const escapeCSV = (value: any) => {
      const stringValue = value?.toString() || '';
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvRows = data.map((row: any) => [
      row.id,
      row.name || '',
      row.age || '',
      row.is_under_18 ? 'Sí' : 'No',
      row.cellphone_number || '',
      row.parent_name || '',
      row.terms_accepted ? 'Sí' : 'No',
      row.is_active ? 'Sí' : 'No',
      row.register_by || '',
      row.dni || '',
      row.check_in ? 'Sí' : 'No',
      row.price_name || '',
      row.price_amount || '',
      row.shirt_size || '',
      row.gender || '',
      row.height || '',
      row.observations || ''
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...csvRows.map((row: any) => row.map(escapeCSV).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filename = `Inscripciones_camp2026_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Inscripciones exportadas exitosamente');
  } catch (error) {
    console.error('Error al exportar:', error);
    toast.error('Error al exportar las inscripciones');
  }
}
