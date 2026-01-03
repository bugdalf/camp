// "use client"

// import { Table } from "@tanstack/react-table"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Filter } from "lucide-react"

// interface DataTableColumnFilterProps<TData> {
//   table: Table<TData>
//   selectedColumn: string
//   onColumnChange: (columnId: string) => void
// }

// export function DataTableColumnFilter<TData>({
//   table,
//   selectedColumn,
//   onColumnChange,
// }: DataTableColumnFilterProps<TData>) {
//   // Obtener todas las columnas que están marcadas como filtrables
//   const filterableColumns = table.getAllColumns().filter(
//     (column) =>
//       column.getIsVisible() &&
//       column.id !== "actions" &&
//       column.columnDef.header &&
//       column.columnDef.meta?.filterable === true // ✅ Solo columnas con filterable: true
//   )

//   return (
//     <Select
//       value={selectedColumn}
//       onValueChange={onColumnChange}
//     >
//       <SelectTrigger className="w-[200px]">
//         <Filter className="mr-2 h-4 w-4" />
//         <SelectValue placeholder="Filtrar por..." />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="all">
//           <span className="font-medium">Todas las columnas</span>
//         </SelectItem>
//         {filterableColumns.map((column) => (
//           <SelectItem key={column.id} value={column.id}>
//             {typeof column.columnDef.header === 'string'
//               ? column.columnDef.header
//               : column.id}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   )
// }