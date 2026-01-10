import { Inscripcion } from "@/shared/types/supabase.types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const columns: ColumnDef<Inscripcion>[] = [
  {
    accessorKey: 'is_active',
    header: 'Estado',
    cell: ({ row }) => (
      <div>
        {row.original.is_active ? (
          <Badge variant="outline" className="bg-green-500 text-white">
            Activo
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-500 text-white">
            Inactivo
          </Badge>
        )}
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        {row.original.is_under_18 && (
          <span className="text-xs text-muted-foreground">
            Menor de edad
          </span>
        )}
      </div>
    ),
    meta: {
      filterable: {
        type: 'text',
        placeholder: '',
        label: 'Buscar por nombre'
      }
    }
  },
  {
    accessorKey: 'age',
    header: 'Edad',
    cell: ({ row }) => (
      <div>
        {row.original.age} años
      </div>
    ),
    meta: {
      visible: false
    }
  },
  {
    accessorKey: 'dni',
    header: 'DNI',
    cell: ({ row }) => (
      <div>
        {row.original.dni}
      </div>
    ),
  },
  {
    accessorKey: 'cellphone_number',
    header: 'Teléfono',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.cellphone_number && (
          <span className="text-sm">{row.original.cellphone_number}</span>
        )}
        {row.original.is_under_18 && row.original.parent_cellphone_number && (
          <span className="text-xs text-muted-foreground">
            Tutor: {row.original.parent_cellphone_number}
          </span>
        )}
      </div>
    ),
    meta: {
      visible: false,
    }
  },
  {
    accessorKey: 'price_id',
    header: 'Precio',
    cell: ({ row }) => (
      <div>
        S/ {row.original.price_amount} ({row.original.price_name})
      </div>
    )
  },
  {
    accessorKey: 'check_in',
    header: 'Check-in',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.check_in ? (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">Check-in</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-orange-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Pendiente</span>
          </div>
        )}
      </div>
    ),
    meta: {
      filterable: {
        type: 'select',
        options: [
          { label: 'Check-in', value: true },
          { label: 'Pendiente', value: false }
        ],
        label: 'Check-in',
        placeholder: 'Check-in'
      }
    },
  },
  {
    accessorKey: 'register_by',
    header: 'Registrado por',
    cell: ({ row }) => (
      <div>
        {row.original.register_by}
      </div>
    )
  },
  {
    accessorKey: 'terms_accepted',
    header: 'Términos',
    cell: ({ row }) => (
      <div className="flex items-center justify-start gap-2">
        {row.original.terms_accepted ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )}
      </div>
    ),
    meta: {
      visible: false,
    }
  },
  {
    accessorKey: 'height',
    header: 'Talla',
    cell: ({ row }) => (
      <div>
        {row.original.height}cm
      </div>
    ),
    meta: {
      visible: false,
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Registrado',
    cell: ({ row }) => {
      if (!row.original.created_at) return '-';

      try {
        const date = new Date(row.original.created_at);
        return (
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true, locale: es })}
          </div>
        );
      } catch {
        return '-';
      }
    },
    meta: {
      visible: false,
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'Actualizado',
    cell: ({ row }) => {
      if (!row.original.updated_at) return '-';

      try {
        const date = new Date(row.original.updated_at);
        return (
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true, locale: es })}
          </div>
        );
      } catch {
        return '-';
      }
    },
    meta: {
      visible: false,
    }
  },
]