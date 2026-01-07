"use client"

import { Button } from "@/components/ui/button"
import { Backpack, Contact } from "lucide-react"
import { useRouter } from "next/navigation"
import { QRScannerModal } from "@/components/own/check-in/qr-scanner-modal"
import { EntityDetailModal } from "@/components/own/check-in/entity-detail-modal"
import { CheckInButton } from "@/components/own/check-in/check-in-button"
import { useCheckIn } from "@/components/own/check-in/use-check-in"

import { Inscripcion, Voluntario } from "@/shared/types/supabase.types"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"
import { useVoluntariosStore } from "@/lib/store/voluntarios.store"

export default function DashboardPage() {
  const router = useRouter()
  const { fetchInscripcionById, handleCheckInInscripcion } = useInscripcionesStore()
  const { fetchVoluntarioById, handleCheckInVoluntario } = useVoluntariosStore()

  const checkInInscripciones = useCheckIn<Inscripcion>({
    type: 'inscripcion',
    fetchById: fetchInscripcionById,
    handleCheckIn: handleCheckInInscripcion,
  })

  const checkInVoluntarios = useCheckIn<Voluntario>({
    type: 'voluntario',
    fetchById: fetchVoluntarioById,
    handleCheckIn: handleCheckInVoluntario,
  })

  return (
    <div className="w-full h-screen flex flex-col p-8 items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-bold">Accesos directos</span>
        <div className="flex justify-center items-center gap-2">
          <Button onClick={() => router.push("/dashboard/inscripciones")}>
            <Backpack className="mr-2" /> Inscripciones
          </Button>
          <Button onClick={() => router.push("/dashboard/voluntarios")}>
            <Contact className="mr-2" />Voluntarios
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-bold">Check-in</span>
        <div className="flex justify-center items-center gap-2">
          <CheckInButton onClick={checkInInscripciones.handleStartScan} label="Check-in Campistas" />
          <CheckInButton onClick={checkInVoluntarios.handleStartScan} label="Check-in Voluntarios" />
        </div>
      </div>

      {/* campistas */}

      <QRScannerModal
        open={checkInInscripciones.showScanModal}
        onClose={checkInInscripciones.handleCloseScanModal}
        onQRScanned={checkInInscripciones.handleQRScanned}
      />

      <EntityDetailModal
        open={checkInInscripciones.showResultModal}
        onClose={checkInInscripciones.handleCloseResultModal}
        entity={checkInInscripciones.scanResult}
        onConfirmCheckIn={checkInInscripciones.handleConfirmCheckIn}
        type="inscripcion"
      />

      {/* voluntarios */}

      <QRScannerModal
        open={checkInVoluntarios.showScanModal}
        onClose={checkInVoluntarios.handleCloseScanModal}
        onQRScanned={checkInVoluntarios.handleQRScanned}
      />

      <EntityDetailModal
        open={checkInVoluntarios.showResultModal}
        onClose={checkInVoluntarios.handleCloseResultModal}
        entity={checkInVoluntarios.scanResult}
        onConfirmCheckIn={checkInVoluntarios.handleConfirmCheckIn}
        type="voluntario"
      />
    </div>
  )
}