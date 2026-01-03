import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteDialogProps {
  openDeleteDialog: boolean
  setOpenDeleteDialog: (open: boolean) => void
  title?: string
  selectedItem?: any
  action: (id: string) => Promise<void>;
}

export default function DeleteDialog({ openDeleteDialog, setOpenDeleteDialog, title, selectedItem, action }: DeleteDialogProps) {

  const handleDelete = async () => {
    if (selectedItem && selectedItem.id) {
      setOpenDeleteDialog(false);
      await action(selectedItem.id);
    }
  }

  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={(open) => setOpenDeleteDialog(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no podra ser recuperada, se cancelara la inscripción de {selectedItem?.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Regresar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Cancelar Inscripción</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
