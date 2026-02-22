"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  SearchIcon,
  UserIcon,
  Loader2,
  QrCodeIcon,
  PhoneIcon,
  ShirtIcon,
  RulerIcon,
  CheckIcon,
  XIcon,
} from "lucide-react"
import { Inscripcion, Pago } from "@/shared/types/supabase.types"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface ManualSearchCampistasModalProps {
  open: boolean
  onClose: () => void
  onSelectInscripcion: (inscripcion: Inscripcion) => void
  onSearch: (searchTerm: string) => Promise<Inscripcion[]>
}

const SHIRT_LABELS: Record<NonNullable<Inscripcion["shirt_size"]>, string> = {
  s: "S",
  m: "M",
  l: "L",
  xl: "XL",
}

export function ManualSearchCampistasModal({
  open,
  onClose,
  onSelectInscripcion,
  onSearch,
}: ManualSearchCampistasModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.trim().length === 0) {
        setInscripciones([])
        return
      }
      setIsLoading(true)
      try {
        const results = await onSearch(debouncedSearch)
        setInscripciones(results)
      } catch (error) {
        console.error("Error buscando campistas:", error)
        setInscripciones([])
      } finally {
        setIsLoading(false)
      }
    }
    performSearch()
  }, [debouncedSearch, onSearch])

  const handleSelect = (inscripcion: Inscripcion) => {
    onSelectInscripcion(inscripcion)
    setSearchTerm("")
    setInscripciones([])
  }

  const handleClose = () => {
    setSearchTerm("")
    setInscripciones([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full md:max-w-xl max-h-[85vh] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon size={18} />
            Buscar Campista
          </DialogTitle>
          <DialogDescription>
            Busca por nombre o DNI para hacer el check-in manualmente.
          </DialogDescription>
        </DialogHeader>

        {/* Buscador */}
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Nombre o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
            autoFocus
          />
          {isLoading && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
              size={18}
            />
          )}
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto space-y-2 -mx-1 px-1">
          {searchTerm.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <SearchIcon size={40} className="opacity-30" />
              <p className="text-sm">Ingresa un nombre o DNI para buscar</p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 size={40} className="opacity-30 animate-spin" />
              <p className="text-sm">Buscando...</p>
            </div>
          ) : inscripciones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <UserIcon size={40} className="opacity-30" />
              <p className="text-sm">No se encontraron campistas</p>
            </div>
          ) : (
            inscripciones.map((inscripcion) => {
              const totalPaid = inscripcion.payments?.reduce((acc, payment) => acc + (payment.payment_amount || 0), 0) || 0;
              const isPaidCompleted = totalPaid >= (inscripcion.price_amount || 0);
              return (
                <div
                  key={inscripcion.id}
                  className="border border-red-400 rounded-xl p-3 flex flex-col gap-3 bg-card"
                >
                  {/* Cabecera */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted rounded-full p-2 shrink-0">
                        <UserIcon size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight">{inscripcion.name}</p>
                        <p className="text-xs text-muted-foreground">
                          DNI: {inscripcion.dni || "No registrado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {inscripcion.check_in && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Ya ingresó
                        </Badge>
                      )}
                      {inscripcion.is_under_18 && (
                        <Badge variant="outline" className="text-xs text-amber-500 border-amber-500">
                          Menor de edad
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Info adicional */}
                  <div className="bg-muted rounded-lg p-2 flex flex-col gap-1.5">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {inscripcion.age && (
                        <span>{inscripcion.age} años</span>
                      )}
                      {inscripcion.gender && (
                        <span>{inscripcion.gender === "varon" ? "Varón" : "Mujer"}</span>
                      )}
                      {inscripcion.cellphone_number && (
                        <span className="flex items-center gap-1">
                          <PhoneIcon size={11} />
                          {inscripcion.cellphone_number}
                        </span>
                      )}
                      {inscripcion.shirt_size && (
                        <span className="flex items-center gap-1">
                          <ShirtIcon size={11} />
                          Talla {SHIRT_LABELS[inscripcion.shirt_size]}
                        </span>
                      )}
                      {inscripcion.height && (
                        <span className="flex items-center gap-1">
                          <RulerIcon size={11} />
                          {inscripcion.height} cm
                        </span>
                      )}
                    </div>

                    {/* Estado de pago */}
                    {inscripcion.price_name && (
                      <div className="flex items-center gap-1 border-t border-border pt-1.5 mt-0.5">
                        <span className="text-xs text-muted-foreground">{inscripcion.price_name}</span>
                        <div className="flex gap-1 grow">
                          {inscripcion.payments?.map((payment: Pago, index: number) => (
                            <div key={`${payment.id}-${index}`} className={cn("flex items-center gap-px px-px rounded text-xs border-2", payment.payment_method === 'efectivo' ? 'border-green-500' : 'border-purple-500')}>
                              {payment.payment_amount}
                              {payment.payment_checked ? <CheckIcon className="h-3 w-3" /> : <XIcon className="h-3 w-3" />}
                            </div>
                          ))}
                        </div>
                        <Badge
                          variant={isPaidCompleted ? "success" : "warning"}
                          className={`text-xs ${!isPaidCompleted ? "text-red-500 border-red-400" : ""}`}
                        >
                          {isPaidCompleted ? "Pago completo" : "Pago pendiente"}
                        </Badge>
                      </div>
                    )}

                    {/* Tutor si es menor */}
                    {inscripcion.is_under_18 && inscripcion.parent_name && (
                      <div className="border-t border-border pt-1.5 mt-0.5">
                        <p className="text-xs text-muted-foreground">
                          Tutor:{" "}
                          <span className="text-foreground font-medium">{inscripcion.parent_name}</span>
                          {inscripcion.parent_cellphone_number && (
                            <span className="ml-2">{inscripcion.parent_cellphone_number}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acción */}
                  <Button
                    className="w-full"
                    size="sm"
                    disabled={!!inscripcion.check_in}
                    onClick={() => handleSelect(inscripcion)}
                  >
                    <QrCodeIcon size={15} />
                    {inscripcion.check_in ? "Ya realizó check-in" : "Marcar Check-in"}
                  </Button>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
