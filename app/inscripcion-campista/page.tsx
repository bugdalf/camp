'use client'

import { useEffect, useState } from "react"
import { Stepper } from "@/components/own/stepper"
import { AutoinscripcionForm } from "./autoinscripcion-form"
import { RegistroCompletado } from "@/components/own/registro-completo"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"
import { Inscripcion, Precio } from "@/shared/types/supabase.types"
import { CopyIcon } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { usePreciosStore } from "@/lib/store/precios.store"

const steps = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Confirmación" },
]

export default function InscripcionCampistaPage() {
  const [step, setStep] = useState(1)
  const [newInscription, setNewInscription] = useState<Inscripcion | null>(null);
  const { createAutoInscripcion } = useInscripcionesStore();
  const { fetchDefaultPrecio } = usePreciosStore();

  const [defaultPrecio, setDefaultPrecio] = useState<Precio | null>(null);

  useEffect(() => {
    const getDefaultPrecio = async () => {
      const defaultPrecio = await fetchDefaultPrecio();
      if (defaultPrecio) {
        setDefaultPrecio(defaultPrecio);
      }
    }
    getDefaultPrecio();

  }, []);

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.info("Número copiado al portapapeles");
  }

  const handleCreate = async (data: Record<string, any>) => {
    const valuesToCreate = {
      ...data,
      payment_method: 'yape',
      register_by: "campista",
      precio_id: defaultPrecio?.id,
      precio_name: defaultPrecio?.name,
      precio_price: defaultPrecio?.price
    }
    const result = await createAutoInscripcion(valuesToCreate);
    if (result) {
      setNewInscription(result);
      setStep(2);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-4 justify-center">
      <Link href="/" className="mb-4">
        <img src="/main-logo.png" alt="Campamento Desafío 2026" className="w-72 m-auto" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">Inscripción -  Campista</h1>
      <Stepper steps={steps} currentStep={step} />

      {step === 1 && (
        <div className="w-full">
          <div className="p-4 mb-4 border-2 border-dashed border-gray-200 rounded-md">
            <p className="text-lg font-bold">Consideraciones para tu inscripción:</p>
            <ul className="list-disc list-inside pl-4">
              <li className="flex flex-col justify-center items-center gap-2">
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
              <li>El monto total a pagar es de <strong>S/ {defaultPrecio?.price}</strong> ({defaultPrecio?.name}) </li>
              <li>Puedes reservar tu inscripción desde <strong>S/ 50</strong></li>
              <li>Adjunta en el formulario una captura de tu comprobante de pago (imagen) clara</li>
              <li>Debes tener entre 14 y 30 años de edad para poder participar</li>
              <li>Si eres menor de edad debes tener <strong>la autorización de tus padres o tutor legal firmada</strong> (se proporciona el documento para descargar en el siguiente paso)</li>
            </ul>
          </div>
          <AutoinscripcionForm
            onCreate={handleCreate}
            defaultPrecio={defaultPrecio}
          />
        </div>
      )}

      {step === 2 && (
        <RegistroCompletado onReset={() => setStep(1)} inscription={newInscription} type="campista" />
      )}
    </div>
  )
}
