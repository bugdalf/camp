"use client"

import { useParams } from "next/navigation"

export default function VoluntarioPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Voluntario {id}</h1>
    </div>
  )
}