'use client'

import { useState } from "react"
// import { InscripcionesForm } from "@/components/own/inscripciones-form"
import type { DialogHandlers } from "@/shared/types/ui.types"
import { Stepper } from "@/components/own/stepper"
import { AutoinscripcionForm } from "../dashboard/inscripciones/autoinscripcion-form"
import { RegistroCompletado } from "@/components/own/registro-completo"

const steps = [
  { id: 1, label: "Formulario" },
  { id: 2, label: "Completado" },
]

export default function InscripcionPage() {
  const [step, setStep] = useState(1)

  // Mock de dialogHandlers para reutilizar tu formulario
  const dialogHandlers: DialogHandlers = {
    openDialog: true,
    setOpenDialog: () => { },
    selectedItem: null,
    openDialogDelete: false,
    setOpenDialogDelete: () => { },
    setSelectedItem: () => { },
  }

  const handleCreate = async (data: Record<string, any>) => {
    console.log("Registro enviado:", data)

    // 👉 Aquí llamas a Supabase / API
    // await createInscripcion(data)

    setStep(2)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <figure className="mb-4">
        <img src="/main-logo.png" alt="Campamento Desafío 2026" className="w-90 m-auto" />
      </figure>
      <h1 className="text-2xl font-bold mb-4">Inscripción -  Campamento Desafío 2026</h1>
      <Stepper steps={steps} currentStep={step} />

      {step === 1 && (
        <AutoinscripcionForm
          onCreate={handleCreate}
        />
      )}

      {step === 2 && (
        <RegistroCompletado onReset={() => setStep(1)} />
      )}
    </div>
  )
}
