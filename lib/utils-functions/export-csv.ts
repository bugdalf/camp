

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    // toast.error('No hay datos para exportar');
    return;
  }

  // Obtener las columnas del primer objeto
  const headers = Object.keys(data[0]);

  // Crear el contenido CSV
  const csvContent = [
    headers.join(','), // Encabezados
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        const stringValue = value?.toString() || '';
        return stringValue.includes(',') || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      }).join(',')
    )
  ].join('\n');

  // Crear el blob y descargar
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \ufeff para UTF-8 BOM
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
