'use client'

import { useEffect, useState } from "react"
import { Stepper } from "@/components/own/stepper"
import { RegistroCompletado } from "@/components/own/registro-completo"
import { Precio, Voluntario } from "@/shared/types/supabase.types"
import { CopyIcon, Download } from "lucide-react"
import { toast } from "sonner"
import { useVoluntariosStore } from "@/lib/store/voluntarios.store"
import { AutovoluntarioForm } from "./autovoluntario-form"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { usePreciosStore } from "@/lib/store/precios.store"

const steps = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Confirmación" },
]

export default function InscripcionVoluntarioPage() {
  const [step, setStep] = useState(1)
  const [newVoluntario, setNewVoluntario] = useState<Voluntario | null>(null);
  const { createVoluntario } = useVoluntariosStore();
  const { precios, fetchPrecios } = usePreciosStore();

  useEffect(() => {
    fetchPrecios();
  }, []);

  const voluntarioPrecio = precios.find(precio => precio.id === '26760908-8cc6-4b33-96f3-6ecbc0d47353');


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

  const handleDownloadPDF = async () => {
    try {
      const supabase = createClient();

      // Descarga el archivo desde Storage
      const { data, error } = await supabase.storage
        .from('inscripciones')
        .download('docs/autorizacionMenor.pdf')

      if (error) {
        toast.error("Error al descargar el archivo");
        console.error(error);
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
      console.error(error);
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
            <p className="text-lg font-bold">Consideraciones para tu inscripción como voluntario:</p>
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
              <li>El monto total a pagar es de <strong>S/ {voluntarioPrecio?.price}</strong> ({voluntarioPrecio?.name}) </li>
              <li>Adjunta en el formulario una captura de tu comprobante de pago (imagen) clara</li>
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
