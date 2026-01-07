'use client'

import { useState } from "react"
import { Stepper } from "@/components/own/stepper"
import { AutoinscripcionForm } from "../dashboard/inscripciones/autoinscripcion-form"
import { RegistroCompletado } from "@/components/own/registro-completo"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"

const steps = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Confirmado" },
]

export default function InscripcionPage() {
  const [step, setStep] = useState(1)
  const { createInscripcion } = useInscripcionesStore();

  const handleCreate = async (data: Record<string, any>) => {
    const valuesToCreate = {
      ...data,
      payment_method: 'yape',
      register_by: data.name + " - campista"
    }
    await createInscripcion(valuesToCreate);
    setStep(2);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-4 justify-center">
      <figure className="mb-4">
        <img src="/main-logo.png" alt="Campamento Desafío 2026" className="w-72 m-auto" />
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
