"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertCircle,
  UserIcon,
  PhoneIcon,
  ShirtIcon,
  ShieldIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
} from "lucide-react"
import { Voluntario } from "@/shared/types/supabase.types"

interface VoluntarioDetailModalProps {
  open: boolean
  onClose: () => void
  entity: Voluntario | null
  onConfirmCheckIn: () => void
}

const SHIRT_LABELS: Record<NonNullable<Voluntario["shirt_size"]>, string> = {
  s: "S", m: "M", l: "L", xl: "XL",
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

export function VoluntarioDetailModal({
  open,
  onClose,
  entity,
  onConfirmCheckIn,
}: VoluntarioDetailModalProps) {
  if (!entity) return null

  const canCheckIn = !!entity.payment_checked

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full md:max-w-xl max-h-[85vh] flex flex-col gap-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Voluntario encontrado
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">

          {/* Datos personales */}
          <div className="border rounded-xl p-3 flex flex-col gap-3 bg-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted rounded-full p-2 shrink-0">
                  <UserIcon size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{entity.name ?? "N/A"}</p>
                  <p className="text-xs text-muted-foreground">DNI: {entity.dni ?? "No registrado"}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {entity.check_in && (
                  <Badge variant="secondary" className="text-xs">✓ Ya ingresó</Badge>
                )}
                {entity.is_under_18 && (
                  <Badge variant="outline" className="text-xs text-amber-500 border-amber-500">
                    Menor de edad
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-muted rounded-lg p-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {entity.age && <span>{entity.age} años</span>}
              {entity.gender && (
                <span>{entity.gender === "varon" ? "Varón" : "Mujer"}</span>
              )}
              {entity.cellphone_number && (
                <span className="flex items-center gap-1">
                  <PhoneIcon size={11} /> {entity.cellphone_number}
                </span>
              )}
              {entity.shirt_size && (
                <span className="flex items-center gap-1">
                  <ShirtIcon size={11} /> Talla {SHIRT_LABELS[entity.shirt_size]}
                </span>
              )}
            </div>

            {entity.commission && (
              <div className="flex items-center gap-2 border-t pt-2">
                <ShieldIcon size={13} className="text-muted-foreground shrink-0" />
                <span className="text-sm font-medium">{COMMISSION_LABELS[entity.commission]}</span>
              </div>
            )}

            {entity.is_under_18 && entity.parent_name && (
              <div className="border-t pt-2 text-xs text-muted-foreground">
                Tutor:{" "}
                <span className="text-foreground font-medium">{entity.parent_name}</span>
                {entity.parent_cellphone_number && (
                  <span className="ml-2">{entity.parent_cellphone_number}</span>
                )}
              </div>
            )}
          </div>

          {/* Estado de pago */}
          <div className="border rounded-xl p-3 flex flex-col gap-2 bg-card">
            <p className="text-sm font-semibold">Pago</p>

            <div className={`flex items-center gap-3 rounded-lg p-3 ${canCheckIn ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
              }`}>
              <div className={`rounded-full p-1.5 ${canCheckIn ? "bg-green-100" : "bg-orange-100"
                }`}>
                {canCheckIn
                  ? <ShieldCheckIcon size={18} className="text-green-600" />
                  : <ShieldAlertIcon size={18} className="text-orange-500" />
                }
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-semibold ${canCheckIn ? "text-green-700" : "text-orange-700"
                  }`}>
                  {canCheckIn ? "Pago verificado" : "Pago pendiente de verificación"}
                </span>
                {entity.payment_method && (
                  <span className="text-xs text-muted-foreground capitalize">
                    Método: {entity.payment_method === "yape" ? "Yape" : "Efectivo"}
                  </span>
                )}
              </div>
            </div>

            {!canCheckIn && (
              <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700">
                  El pago debe estar verificado antes de realizar el check-in.
                </p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <Button onClick={onConfirmCheckIn} className="flex-1" disabled={!canCheckIn}>
              {canCheckIn
                ? entity.check_in ? "Cancelar check-in" : "Confirmar check-in"
                : "Check-in no disponible"
              }
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cerrar
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
