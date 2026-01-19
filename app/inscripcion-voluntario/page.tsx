'use client'

import { useState } from "react"
import { Stepper } from "@/components/own/stepper"
import { RegistroCompletado } from "@/components/own/inscripcion/registro-completo"
import { Voluntario } from "@/shared/types/supabase.types"
import { useVoluntariosStore } from "@/lib/store/voluntarios.store"
import { AutovoluntarioForm } from "./autovoluntario-form"
import Link from "next/link"
import FirstInfoVoluntario from "./first-info"

const steps = [
  { id: 1, label: "Instrucciones" },
  { id: 2, label: "Formulario" },
  { id: 3, label: "Confirmación" },
]

export default function InscripcionVoluntarioPage() {
  const [step, setStep] = useState(1)
  const [newVoluntario, setNewVoluntario] = useState<Voluntario | null>(null);
  const { createVoluntario } = useVoluntariosStore();

  const handleCreate = async (data: Record<string, any>) => {
    const valuesToCreate = {
      ...data,
      payment_method: 'yape',
      register_by: "voluntario"
    }
    const result = await createVoluntario(valuesToCreate);
    if (result) {
      setNewVoluntario(result);
      setStep(3);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-4 justify-center">
      <Link href="/" className="mb-4">
        <img src="/main-logo.webp" alt="Campamento Desafío 2026" className="w-72 m-auto" />
      </Link>
      <h1 className="font-display text-2xl font-bold mb-4">Inscripción -  Voluntario</h1>
      <Stepper steps={steps} currentStep={step} />
      {step === 1 && (
        <div className="w-full">
          <FirstInfoVoluntario setStep={setStep} />
        </div>
      )}

      {step === 2 && (
        <div className="w-full">
          <AutovoluntarioForm
            onCreate={handleCreate}
            setStep={setStep}
          />
        </div>
      )}

      {step === 3 && (
        <RegistroCompletado onReset={() => setStep(1)} inscription={newVoluntario} type="voluntario" />
      )}
    </div>
  )
}
