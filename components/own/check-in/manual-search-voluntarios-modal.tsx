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
  ShieldIcon,
  PhoneIcon,
  ShirtIcon,
} from "lucide-react"
import { Voluntario } from "@/shared/types/supabase.types"
import { useDebounce } from "@/lib/hooks/use-debounce"


interface ManualSearchVoluntariosModalProps {
  open: boolean
  onClose: () => void
  onSelectVoluntario: (voluntario: Voluntario) => void
  onSearch: (searchTerm: string) => Promise<Voluntario[]>
}

const COMMISSION_LABELS: Record<NonNullable<Voluntario["commission"]>, string> = {
  "logistica": "Logística",
  "recepcion": "Recepción",
  "programacion-actividades": "Programación y Actividades",
  "sonido-luces": "Sonido y Luces",
  "publicidad": "Publicidad",
  "alimentacion-limpieza": "Alimentación y Limpieza",
  "finanzas": "Finanzas",
  "atencion-pastores": "Atención a Pastores",
  "jueces": "Jueces",
  "contenido-digital": "Contenido Digital",
  "lideres-equipo": "Líderes de Equipo",
  "dinamicas-souvenires": "Dinámicas y Souvenires",
  "salud": "Salud",
}

const SHIRT_LABELS: Record<NonNullable<Voluntario["shirt_size"]>, string> = {
  s: "S",
  m: "M",
  l: "L",
  xl: "XL",
}

export function ManualSearchVoluntariosModal({
  open,
  onClose,
  onSelectVoluntario,
  onSearch,
}: ManualSearchVoluntariosModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.trim().length === 0) {
        setVoluntarios([])
        return
      }
      setIsLoading(true)
      try {
        const results = await onSearch(debouncedSearch)
        setVoluntarios(results)
      } catch (error) {
        console.error("Error searching voluntarios:", error)
        setVoluntarios([])
      } finally {
        setIsLoading(false)
      }
    }
    performSearch()
  }, [debouncedSearch, onSearch])

  const handleSelect = (voluntario: Voluntario) => {
    onSelectVoluntario(voluntario)
    setSearchTerm("")
    setVoluntarios([])
  }

  const handleClose = () => {
    setSearchTerm("")
    setVoluntarios([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full md:max-w-xl max-h-[85vh] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldIcon size={18} />
            Buscar Voluntario
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
          ) : voluntarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <UserIcon size={40} className="opacity-30" />
              <p className="text-sm">No se encontraron voluntarios</p>
            </div>
          ) : (
            voluntarios.map((voluntario) => (
              <div
                key={voluntario.id}
                className="border rounded-xl p-3 flex flex-col gap-3 bg-card"
              >
                {/* Cabecera */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted rounded-full p-2 shrink-0">
                      <UserIcon size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-tight">
                        {voluntario.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        DNI: {voluntario.dni || "No registrado"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {voluntario.check_in && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ Ya ingresó
                      </Badge>
                    )}
                    {voluntario.is_under_18 && (
                      <Badge variant="outline" className="text-xs text-amber-500 border-amber-500">
                        Menor de edad
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Info de comisión y detalles */}
                <div className="bg-muted rounded-lg p-2 flex flex-col gap-1.5">
                  {voluntario.commission && (
                    <div className="flex items-center gap-2">
                      <ShieldIcon size={13} className="text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium">
                        {COMMISSION_LABELS[voluntario.commission]}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {voluntario.cellphone_number && (
                      <span className="flex items-center gap-1">
                        <PhoneIcon size={11} />
                        {voluntario.cellphone_number}
                      </span>
                    )}
                    {voluntario.shirt_size && (
                      <span className="flex items-center gap-1">
                        <ShirtIcon size={11} />
                        Talla {SHIRT_LABELS[voluntario.shirt_size]}
                      </span>
                    )}
                    {voluntario.gender && (
                      <span className="capitalize text-xs">
                        {voluntario.gender === "varon" ? "Varón" : "Mujer"}
                      </span>
                    )}
                    {voluntario.age && (
                      <span className="text-xs">{voluntario.age} años</span>
                    )}
                  </div>

                  {/* Datos del tutor si es menor */}
                  {voluntario.is_under_18 && voluntario.parent_name && (
                    <div className="border-t border-border pt-1.5 mt-0.5">
                      <p className="text-xs text-muted-foreground">
                        Tutor: <span className="text-foreground font-medium">{voluntario.parent_name}</span>
                        {voluntario.parent_cellphone_number && (
                          <span className="ml-2">{voluntario.parent_cellphone_number}</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acción */}
                <Button
                  className="w-full"
                  size="sm"
                  disabled={!!voluntario.check_in}
                  onClick={() => handleSelect(voluntario)}
                >
                  <QrCodeIcon size={15} />
                  {voluntario.check_in ? "Ya realizó check-in" : "Marcar Check-in"}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}