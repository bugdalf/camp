"use client"

import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

interface CheckInButtonProps {
  onClick: () => void
  label: string
}

export function CheckInButton({ onClick, label }: CheckInButtonProps) {
  return (
    <Button onClick={onClick} className="grow">
      <QrCode className="" /> {label}
    </Button>
  )
}