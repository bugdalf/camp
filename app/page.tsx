"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {

  return (
    <main className="h-screen w-full min-h-screen flex flex-col items-center justify-center px-4 bg-slate-950">
      {/* hero */}
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 relative">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="font-display text-3xl text-white">
            22 al 26 FEBRERO
          </p>
          <figure className="w-lg">
            <img src="/main-logo.png" alt="" />
          </figure>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="font-display text-2xl text-white">Cupos: 200/200</p>
          <Button variant="cta" size="cta">
            Registrate hoy
          </Button>
        </div>
        {/* Container de los equipos */}
        <div className="grid grid-cols-3 gap-4 h-2/6 w-full absolute bottom-0">
          <div className="h-1/2 self-start flex gap-1.5">
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="h-1/2 self-end flex gap-1.5">
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="h-1/2 self-start flex gap-1.5">
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-30 h-30 aspect-square rounded overflow-hidden cursor-pointer">
              <img src="/teams/tigres-avatar.png" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex gap-3 flex-col">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Create Account
            </Button>
          </Link>
        </div> */}
    </main>
  )
}
