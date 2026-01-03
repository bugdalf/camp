"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableHeader } from "./data-table-header"
import { Button } from "@/components/ui/button"
import { EllipsisVerticalIcon, PenIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { DialogHandlers, ExtraAction } from "@/shared/types/ui.types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  entity?: string
  dialogHandlers: DialogHandlers
  extraActions?: ExtraAction[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  entity,
  dialogHandlers,
  extraActions
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("")


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    },
  })

  return (
    <div className="overflow-hidden grow flex flex-col">
      <div className="flex items-center justify-between py-4 px-1">
        <Input
          placeholder="Buscar..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button onClick={() => {
            dialogHandlers.setSelectedItem(null);
            dialogHandlers.setOpenDialog(true);
          }}>
            <PlusIcon />Crear {entity}
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="grow overflow-auto">
        <Table className="">
          <DataTableHeader table={table} />
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-2 h-8 data-[state=open]:bg-slate-200 dark:data-[state=open]:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700">
                          <EllipsisVerticalIcon className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          dialogHandlers.setSelectedItem(row.original);
                          dialogHandlers.setOpenDialog(true);
                        }}>
                          <PenIcon /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          dialogHandlers.setSelectedItem(row.original)
                          dialogHandlers.setOpenDialogDelete(true);
                        }}>
                          <Trash2Icon /> Eliminar
                        </DropdownMenuItem>
                        {extraActions?.map((action) => (
                          <DropdownMenuItem onClick={() => action.handler(row.original)} key={action.label}>
                            <action.icon /> {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}