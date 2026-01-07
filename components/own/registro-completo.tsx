import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RegistroCompletadoProps {
  onReset?: () => void
}

export function RegistroCompletado({ onReset }: RegistroCompletadoProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
      <CheckCircle className="w-16 h-16 text-primary" />

      <h2 className="text-2xl font-semibold">
        ¡Registro completado!
      </h2>

      <p className="text-muted-foreground max-w-md">
        Tu inscripción al evento se realizó correctamente.
        Pronto nos pondremos en contacto contigo.
      </p>

      {onReset && (
        <Button variant="outline" onClick={onReset}>
          Registrar otra persona
        </Button>
      )}
    </div>
  )
}
