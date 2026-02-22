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
  RulerIcon,
  CreditCardIcon,
  BanknoteIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
  ClockIcon,
} from "lucide-react"
import { Inscripcion, Pago } from "@/shared/types/supabase.types"

interface InscripcionDetailModalProps {
  open: boolean
  onClose: () => void
  entity: Inscripcion | null
  onConfirmCheckIn: () => void
}

const SHIRT_LABELS: Record<NonNullable<Inscripcion["shirt_size"]>, string> = {
  s: "S", m: "M", l: "L", xl: "XL",
}

const PAYMENT_METHOD_LABELS: Record<NonNullable<Pago["payment_method"]>, string> = {
  yape: "Yape",
  efectivo: "Efectivo",
}

function getPagoStatus(pagos: Pago[], priceAmount?: number) {
  const totalPagado = pagos.reduce((sum, p) => sum + (p.payment_amount ?? 0), 0)
  const montoOk = priceAmount != null ? totalPagado >= priceAmount : pagos.length > 0
  const todosChecked = pagos.length > 0 && pagos.every((p) => p.payment_checked)
  return { totalPagado, montoOk, todosChecked, canCheckIn: montoOk && todosChecked }
}

export function InscripcionDetailModal({
  open,
  onClose,
  entity,
  onConfirmCheckIn,
}: InscripcionDetailModalProps) {
  if (!entity) return null

  const pagos: Pago[] = entity.payments ?? []
  const { totalPagado, montoOk, todosChecked, canCheckIn } = getPagoStatus(pagos, entity.price_amount)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full md:max-w-xl max-h-[85vh] flex flex-col gap-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Inscripción encontrada
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
              {entity.height && (
                <span className="flex items-center gap-1">
                  <RulerIcon size={11} /> {entity.height} cm
                </span>
              )}
            </div>

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

          {/* Pagos */}
          <div className="border rounded-xl p-3 flex flex-col gap-2 bg-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Pagos</p>
              {entity.price_amount != null && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${montoOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  Saldo: S/ {(entity.price_amount - totalPagado).toFixed(2)}
                </span>
              )}
            </div>

            {pagos.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg p-2">
                <AlertCircle size={14} className="text-orange-400 shrink-0" />
                Sin pagos registrados
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pagos.map((pago, i) => (
                  <div key={pago.id ?? i} className="flex items-center gap-2 bg-muted rounded-lg p-2">
                    <div className="bg-background rounded-md p-1.5 shrink-0">
                      {pago.payment_method === "yape"
                        ? <CreditCardIcon size={14} className="text-purple-500" />
                        : <BanknoteIcon size={14} className="text-green-600" />
                      }
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">
                          S/ {pago.payment_amount?.toFixed(2) ?? "0.00"}
                        </span>
                        {pago.payment_checked ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <ShieldCheckIcon size={13} /> Verificado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                            <ShieldAlertIcon size={13} /> Pendiente
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                        {pago.payment_method && (
                          <span>{PAYMENT_METHOD_LABELS[pago.payment_method]}</span>
                        )}
                        {pago.caja_name && <span>{pago.caja_name}</span>}
                        {pago.created_at && (
                          <span className="flex items-center gap-1">
                            <ClockIcon size={10} />
                            {new Date(pago.created_at).toLocaleDateString("es-PE", {
                              day: "2-digit", month: "2-digit", year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!montoOk && (
              <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">
                  El monto pagado (S/ {totalPagado.toFixed(2)}) no cubre el total requerido (S/ {entity.price_amount?.toFixed(2)}).
                </p>
              </div>
            )}
            {montoOk && !todosChecked && (
              <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700">
                  Hay pagos pendientes de verificación. Deben verificarse antes del check-in.
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
