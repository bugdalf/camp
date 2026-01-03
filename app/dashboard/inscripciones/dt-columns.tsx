import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'order',
    header: 'Orden',
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => <div style={{ backgroundColor: row.original.color }} className="w-6 h-6 rounded" />,
  },
  // {
  //   accessorKey: 'created_at',
  //   header: 'Creado',
  //   cell: ({ row }) => row.original.created_at,
  // },
  // {
  //   accessorKey: 'updated_at',
  //   header: 'Actualizado',
  //   cell: ({ row }) => row.original.updated_at,
  // },
]