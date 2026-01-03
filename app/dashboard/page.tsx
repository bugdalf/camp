"use client"

import { Button } from "@/components/ui/button"
import { BackpackIcon, ContactIcon } from "lucide-react"
import { useRouter } from "next/navigation"


export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="w-full h-screen flex flex-col p-8 items-center gap-4">
      <Button onClick={() => router.push("/dashboard/inscripciones")}><BackpackIcon /> Inscripciones</Button>
      <Button onClick={() => router.push("/dashboard/voluntarios")}><ContactIcon />Voluntarios</Button>
    </div>
  )
}
