"use client"

import { useParams } from "next/navigation"

export default function CampistaPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Campista {id}</h1>
    </div>
  )
}