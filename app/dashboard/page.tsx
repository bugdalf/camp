"use client"

import { Button } from "@/components/ui/button"
import { Backpack, Contact, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { QRScannerModal } from "@/components/own/check-in/qr-scanner-modal"
import { EntityDetailModal } from "@/components/own/check-in/entity-detail-modal"
import { CheckInButton } from "@/components/own/check-in/check-in-button"
import { useCheckIn } from "@/components/own/check-in/use-check-in"
import { useState } from "react"

import { Inscripcion, Voluntario } from "@/shared/types/supabase.types"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"
import { useVoluntariosStore } from "@/lib/store/voluntarios.store"
import { ManualSearchVoluntariosModal } from "@/components/own/check-in/manual-search-voluntarios-modal"
import { ManualSearchCampistasModal } from "@/components/own/check-in/manual-search-inscripcion-modal"

export default function DashboardPage() {
  const router = useRouter()

  const {
    fetchInscripcionById,
    handleCheckInInscripcion,
    fetchInscripcionesBySearch,
  } = useInscripcionesStore()

  const {
    fetchVoluntarioById,
    handleCheckInVoluntario,
    fetchVoluntariosBySearch,
  } = useVoluntariosStore()

  const [showSearchCampistas, setShowSearchCampistas] = useState(false)
  const [showSearchVoluntarios, setShowSearchVoluntarios] = useState(false)

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

  const handleSelectCampista = (inscripcion: Inscripcion) => {
    setShowSearchCampistas(false)
    checkInInscripciones.handleManualSelection(inscripcion)
  }

  const handleSelectVoluntario = (voluntario: Voluntario) => {
    setShowSearchVoluntarios(false)
    checkInVoluntarios.handleManualSelection(voluntario)
  }

  return (
    <div className="w-full min-h-screen flex flex-col px-4 py-8 md:px-8 gap-8">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Panel de control de check-in</p>
      </div>

      {/* Accesos directos */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-center md:text-left">Accesos directos</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="outline"
            className="h-16 flex flex-col gap-1 text-sm"
            onClick={() => router.push("/dashboard/inscripciones")}
          >
            <Backpack className="size-5" />
            Inscripciones
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-16 flex flex-col gap-1 text-sm"
            onClick={() => router.push("/dashboard/voluntarios")}
          >
            <Contact className="size-5" />
            Voluntarios
          </Button>
        </div>
      </section>

      {/* Check-in */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-center md:text-left">Check-in</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          {/* Campistas */}
          <div className="flex gap-1 p-2 border-2 border-dashed rounded-lg">
            <Button
              variant="outline"
              className="grow"
              onClick={() => setShowSearchCampistas(true)}
            >
              <SearchIcon />
              Buscar Campista
            </Button>
            <CheckInButton
              onClick={checkInInscripciones.handleStartScan}
              label="Campistas"
            />
          </div>

          {/* Voluntarios */}
          <div className="flex gap-1 p-2 border-2 border-dashed rounded-lg">
            <Button
              variant="outline"
              className="grow"
              onClick={() => setShowSearchVoluntarios(true)}
            >
              <SearchIcon />
              Buscar Voluntario
            </Button>
            <CheckInButton
              onClick={checkInVoluntarios.handleStartScan}
              label="Voluntarios"
            />
          </div>

        </div>
      </section>

      {/* Modales — campistas */}
      <ManualSearchCampistasModal
        open={showSearchCampistas}
        onClose={() => setShowSearchCampistas(false)}
        onSearch={fetchInscripcionesBySearch}
        onSelectInscripcion={handleSelectCampista}
      />
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

      {/* Modales — voluntarios */}
      <ManualSearchVoluntariosModal
        open={showSearchVoluntarios}
        onClose={() => setShowSearchVoluntarios(false)}
        onSearch={fetchVoluntariosBySearch}
        onSelectVoluntario={handleSelectVoluntario}
      />
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
