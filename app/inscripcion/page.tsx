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

export default function InscripcionCampistaPage() {
  const [step, setStep] = useState(1)
  const { createInscripcion } = useInscripcionesStore();

  const handleCreate = async (data: Record<string, any>) => {
    const valuesToCreate = {
      ...data,
      payment_method: 'yape',
      register_by: "campista"
    }
    const result = await createInscripcion(valuesToCreate);
    if (result) {
      setStep(2);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-4 justify-center">
      <figure className="mb-4">
        <img src="/main-logo.png" alt="Campamento Desafío 2026" className="w-72 m-auto" />
      </figure>
      <h1 className="text-2xl font-bold mb-4">Inscripción -  Campista</h1>
      <Stepper steps={steps} currentStep={step} />

      {step === 1 && (
        <div className="w-full">
          <div className="p-4 mb-4 border-2 border-dashed border-gray-200 rounded-md">
            <p className="text-lg font-bold">Consideraciones para tu inscripción:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Estos son los números de Yape para pagar: 987654321 - 987654321</li>
              <li>Adjunta en el formulario una captura de tu comprobante de pago (imagen) clara</li>
              <li>Verifica que los datos del formulario sean correctos y verdaderos</li>
              <li>(mejorar)</li>
            </ul>
          </div>
          <AutoinscripcionForm
            onCreate={handleCreate}
          />
        </div>
      )}

      {step === 2 && (
        <RegistroCompletado onReset={() => setStep(1)} />
      )}
    </div>
  )
}
