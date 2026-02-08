'use client'

import { DataTable } from "@/components/own/table/data-table";
import { DialogHandlers } from "@/shared/types/ui.types";
import { useState, useMemo, useEffect } from "react";
import { columns } from "./dt-columns";
import GenericDialog from "@/components/own/generic-dialog/generic-dialog";
import DeleteDialog from "@/components/own/generic-dialog/delete-dialog";
import { CajaForm } from "./caja-form";
import { useCajasStore } from "@/lib/store/cajas.store";
import { Caja } from "@/shared/types/supabase.types";

function useDialogHandlers(): DialogHandlers {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [customAction, setCustomAction] = useState<string | undefined>(undefined);

  return useMemo(() => ({
    openDialog,
    setOpenDialog,
    openDialogDelete,
    setOpenDialogDelete,
    selectedItem,
    setSelectedItem,
    customAction,
    setCustomAction
  }), [openDialog, setOpenDialog, openDialogDelete, setOpenDialogDelete, selectedItem, setSelectedItem, customAction, setCustomAction]);
}


export default function CajasPage() {
  const dialogHandlers = useDialogHandlers();
  const { cajas, fetchCajas, createCaja, updateCaja, deleteCaja } = useCajasStore();

  useEffect(() => {
    fetchCajas();
  }, []);

  return (
    <div className="h-full flex flex-col overflow-auto">
      <h2 className="text-2xl font-bold">Cajeros</h2>
      <p className="text-xs">Registro de todas las cajas</p>
      <DataTable<Caja, unknown>
        columns={columns}
        data={cajas || []}
        entity=""
        dialogHandlers={dialogHandlers}
      />
      <GenericDialog
        openDialog={dialogHandlers.openDialog}
        setOpenDialog={dialogHandlers.setOpenDialog}
        title={dialogHandlers.selectedItem ? 'Editar Cajero(a)' : 'Nuevo Cajero(a)'}
      >
        <CajaForm dialogHandlers={dialogHandlers} onCreate={createCaja} onEdit={updateCaja} />
      </GenericDialog>
      <DeleteDialog
        openDeleteDialog={dialogHandlers.openDialogDelete}
        setOpenDeleteDialog={dialogHandlers.setOpenDialogDelete}
        selectedItem={dialogHandlers.selectedItem}
        action={deleteCaja}
      />
    </div>
  )
}
