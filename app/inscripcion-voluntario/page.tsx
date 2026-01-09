'use client'

import { useState } from "react"
import { Stepper } from "@/components/own/stepper"
import { AutoinscripcionForm } from "../inscripcion-campista/autoinscripcion-form"
import { RegistroCompletado } from "@/components/own/registro-completo"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"
import { Inscripcion, Voluntario } from "@/shared/types/supabase.types"
import { CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { useVoluntariosStore } from "@/lib/store/voluntarios.store"
import { AutovoluntarioForm } from "./autovoluntario-form"
import Link from "next/link"

const steps = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Confirmado" },
]

export default function InscripcionVoluntarioPage() {
  const [step, setStep] = useState(1)
  const [newVoluntario, setNewVoluntario] = useState<Voluntario | null>(null);
  const { createVoluntario } = useVoluntariosStore();

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.info("Número copiado al portapapeles");
  }

  const handleCreate = async (data: Record<string, any>) => {
    const valuesToCreate = {
      ...data,
      payment_method: 'yape',
      register_by: "voluntario"
    }
    const result = await createVoluntario(valuesToCreate);
    if (result) {
      setNewVoluntario(result);
      setStep(2);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-4 justify-center">
      <Link href="/" className="mb-4">
        <img src="/main-logo.png" alt="Campamento Desafío 2026" className="w-72 m-auto" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">Inscripción -  Voluntario</h1>
      <Stepper steps={steps} currentStep={step} />

      {step === 1 && (
        <div className="w-full">
          <div className="p-4 mb-4 border-2 border-dashed border-gray-200 rounded-md">
            <p className="text-lg font-bold">Consideraciones para tu inscripción:</p>
            <ul className="list-disc list-inside pl-4">
              <li className="flex items-center gap-2">
                <span>Estos son los números de Yape para pagar: </span>
                <div className="flex gap-2">
                  <div onClick={() => handleCopyNumber("987654321")} className="flex items-center gap-2 bg-slate-100 px-2 py-2 rounded border border-gray-200 cursor-pointer">
                    987654321
                    <CopyIcon />
                  </div>
                  <div onClick={() => handleCopyNumber("987654321")} className="flex items-center gap-2 bg-slate-100 px-2 py-2 rounded border border-gray-200 cursor-pointer">
                    987654321
                    <CopyIcon />
                  </div>
                </div>
              </li>
              <li>Adjunta en el formulario una captura de tu comprobante de pago (imagen) clara</li>
              <li>Verifica que los datos del formulario sean correctos y verdaderos</li>
              <li>(mejorar)</li>
            </ul>
          </div>
          <AutovoluntarioForm
            onCreate={handleCreate}
          />
        </div>
      )}

      {step === 2 && (
        <RegistroCompletado onReset={() => setStep(1)} inscription={newVoluntario} type="voluntario" />
      )}
    </div>
  )
}
