"use client"

import { DataTable } from "@/components/own/table/data-table";
import { DialogHandlers } from "@/shared/types/ui.types";
import { useState, useMemo, useEffect } from "react";
import { columns } from "./dt-columns";
import GenericDialog from "@/components/own/generic-dialog/generic-dialog";
import DeleteDialog from "@/components/own/generic-dialog/delete-dialog";
import { useInscripcionesStore } from "@/lib/store/inscripciones.store";
import { InscripcionesForm } from "./inscripciones-form";

function useDialogHandlers(): DialogHandlers {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return useMemo(() => ({
    openDialog,
    setOpenDialog,
    openDialogDelete,
    setOpenDialogDelete,
    selectedItem,
    setSelectedItem,
  }), [openDialog, setOpenDialog, openDialogDelete, setOpenDialogDelete, selectedItem, setSelectedItem]);
}

export default function InscripcionesPage() {
  const dialogHandlers = useDialogHandlers();
  const { inscripciones, fetchInscripciones, createInscripcion, updateInscripcion, deleteInscripcion } = useInscripcionesStore();

  useEffect(() => {
    fetchInscripciones();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold">Inscripciones</h2>
      <p className="text-xs">Registro de todos los campistas</p>
      <DataTable
        columns={columns}
        data={inscripciones || []}
        entity=""
        dialogHandlers={dialogHandlers}
      />
      <GenericDialog
        openDialog={dialogHandlers.openDialog}
        setOpenDialog={dialogHandlers.setOpenDialog}
        title="Inscribir"
      >
        <InscripcionesForm dialogHandlers={dialogHandlers} onCreate={createInscripcion} onEdit={updateInscripcion} />
      </GenericDialog>
      <DeleteDialog
        openDeleteDialog={dialogHandlers.openDialogDelete}
        setOpenDeleteDialog={dialogHandlers.setOpenDialogDelete}
        selectedItem={dialogHandlers.selectedItem}
        title="Eliminar Grupo de clientes"
        action={deleteInscripcion}
      />
    </div>
  )
}