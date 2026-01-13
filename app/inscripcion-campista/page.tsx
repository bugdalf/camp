'use client'

import { useEffect, useState } from "react"
import { Stepper } from "@/components/own/stepper"
import { AutoinscripcionForm } from "./autoinscripcion-form"
import { RegistroCompletado } from "@/components/own/registro-completo"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"
import { Inscripcion, Precio } from "@/shared/types/supabase.types"
import { CopyIcon, Download } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { usePreciosStore } from "@/lib/store/precios.store"
import { createClient } from "@/lib/supabase/client" // Ajusta la ruta según tu proyecto

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

  const handleDownloadPDF = async () => {
    try {
      const supabase = createClient();

      // Descarga el archivo desde Storage
      const { data, error } = await supabase.storage
        .from('inscripciones')
        .download('docs/autorizacionMenor.pdf')

      if (error) {
        toast.error("Error al descargar el archivo");
        return;
      }

      // Crea una URL temporal para el blob
      const url = window.URL.createObjectURL(data);

      // Crea un link temporal y simula el click para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = 'autorizacionMenor.pdf';
      document.body.appendChild(link);
      link.click();

      // Limpia
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Archivo descargado correctamente, revisa tus descargas");
    } catch (error) {
      toast.error("Error al descargar el archivo");
    }
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
        <img src="/main-logo-webp" alt="Campamento Desafío 2026" className="w-72 m-auto" />
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
                  <div onClick={() => handleCopyNumber("950569436")} className="flex flex-col items-center gap-px bg-slate-100 px-2 py-2 rounded border border-gray-200 cursor-pointer">
                    {/* <div>qr</div> */}
                    <div>José Mamani - plin</div>
                    <div className="flex gap-2 items-center">950569436 <CopyIcon /></div>
                  </div>
                  <div onClick={() => handleCopyNumber("956890060")} className="flex flex-col items-center gap-px bg-slate-100 px-2 py-2 rounded border border-gray-200 cursor-pointer">
                    {/* <div>qr</div> */}
                    <div>Victor Atamari - yape</div>
                    <div className="flex gap-2 items-center">956890060 <CopyIcon /></div>
                  </div>
                </div>
              </li>
              <li>El monto total a pagar es de <strong>S/ {defaultPrecio?.price}</strong> ({defaultPrecio?.name}) </li>
              <li>Puedes reservar tu inscripción desde <strong>S/ 50</strong></li>
              <li>Adjunta en el formulario una captura de tu comprobante de pago (imagen) clara</li>
              <li>Debes tener entre 14 y 30 años de edad para poder participar</li>
              <li>
                Si eres menor de edad debes tener <strong>la autorización de tus padres o tutor legal firmada</strong>{' '}
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                >
                  <Download size={16} />
                </button>
              </li>
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