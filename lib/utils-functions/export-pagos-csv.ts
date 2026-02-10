import { toast } from 'sonner';
import { createClient } from '../supabase/client';

const supabase = createClient();

export const exportPagosCSV = async () => {
  try {
    const { data, error } = await supabase
      .from('inscripciones')
      .select(`
        id, 
        name, 
        dni, 
        price_name, 
        price_amount,
        payments
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      toast.error('No hay pagos para exportar');
      return;
    }

    const headers = [
      'ID Inscripción',
      'Nombre',
      'DNI',
      'Precio',
      'Monto Total',
      'Monto Pagado',
      'Método de Pago',
      'Caja',
      'Verificado',
      'Registrado por',
      'Fecha de Pago',
      'Saldo'
    ];

    const escapeCSV = (value: any) => {
      const stringValue = value?.toString() || '';
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Expandir cada inscripción por sus pagos
    const csvRows: any[] = [];
    data.forEach((inscripcion: any) => {
      const montoTotal = parseFloat(inscripcion.price_amount) || 0;

      if (inscripcion.payments && inscripcion.payments.length > 0) {
        // Calcular total pagado
        const totalPagado = inscripcion.payments.reduce(
          (sum: number, payment: any) => sum + (parseFloat(payment.payment_amount) || 0),
          0
        );
        const saldo = montoTotal - totalPagado;

        inscripcion.payments.forEach((payment: any, index: number) => {
          const esUltimoPago = index === inscripcion.payments.length - 1;

          csvRows.push([
            inscripcion.id,
            inscripcion.name || '',
            inscripcion.dni || '',
            inscripcion.price_name || '',
            inscripcion.price_amount || '',
            payment.payment_amount || '',
            payment.payment_method || '',
            payment.caja_name || '',
            payment.payment_checked ? 'Sí' : 'No',
            payment.register_by || '',
            payment.created_at ? new Date(payment.created_at).toLocaleDateString('es-ES') : '',
            esUltimoPago ? saldo.toFixed(2) : ''
          ]);
        });
      } else {
        // Inscripción sin pagos - saldo = monto total
        csvRows.push([
          inscripcion.id,
          inscripcion.name || '',
          inscripcion.dni || '',
          inscripcion.price_name || '',
          inscripcion.price_amount || '',
          '',
          '',
          '',
          '',
          '',
          '',
          montoTotal.toFixed(2)
        ]);
      }
    });

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...csvRows.map((row: any) => row.map(escapeCSV).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filename = `pagos_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Reporte de pagos exportado exitosamente');
  } catch (error) {
    console.error('Error al exportar:', error);
    toast.error('Error al exportar el reporte de pagos');
  }
}
