"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"

export default function LandingPage() {
  const [inscripcionesCount, setInscripcionesCount] = useState<number>(0);
  const { fetchInscripcionesCount } = useInscripcionesStore();

  useEffect(() => {
    const fetchCount = async () => {
      const count = await fetchInscripcionesCount();
      setInscripcionesCount(count);
    };
    fetchCount();
  }, []);

  return (
    <div className="bg-[#040810]">
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen w-full flex flex-col justify-center gap-4 items-center bg-[#040810] bg-[url('/fondo.webp')] bg-cover bg-center bg-no-repeat mask-fade-bottom">
        {/* Fecha del evento */}
        <p className="font-display text-2xl md:text-3xl text-white text-center p-3 animate-in fade-in slide-in-from-top-8 duration-700 delay-150">
          2026
        </p>

        {/* Logo + CTA */}
        <figure className="w-full max-w-lg relative flex items-center justify-center h-2/3">

          {/* Logo principal */}
          <div className="animate-in fade-in zoom-in duration-700 delay-300">
            <img
              src="/main-logo.webp"
              alt="Logo principal del campamento"
              className="w-full h-auto max-h-[220px] object-contain drop-shadow-2xl"
            />
          </div>
        </figure>
        <figure>
          <div className="animate-in fade-in zoom-in duration-700 delay-300">
            <img
              src="/fecha.webp"
              alt="Fecha del evento"
              className="w-full h-auto max-h-[60px] object-contain drop-shadow-2xl"
            />
          </div>
        </figure>
        {/* CTA + Precios */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="flex flex-col items-center font-display text-white">
            <span className="text-xs">Cupos Limitados:</span>
            <span className="text-xl md:text-xl">{inscripcionesCount}/200</span>
          </div>

          <Link href="/inscripcion-campista">
            <Button
              variant="cta"
              size="cta"
              className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-bounce"
            >
              <span>Regístrate</span>
              <span>hoy</span>
            </Button>
          </Link>

          {/* PRECIOS */}
          <div className="mt-2 text-center">
            <p className="text-emerald-400 font-semibold text-sm md:text-base">
              Preventa: S/ 190 <span className="text-xs">(Ahorra S/ 30) hasta el 8 de febrero</span>
            </p>
            <p className="text-slate-400 text-xs md:text-sm">
              Venta normal: S/ 220
            </p>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="w-full bg-[#040810]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-white font-semibold mb-1">Campamento desafío 2026</p>
              <p className="text-slate-400 text-sm">22 al 26 de Febrero</p>
            </div>

            <div className="flex gap-6 text-sm">
              <Link href="/login" className="text-slate-800 hover:text-white transition-all duration-300">
                Iniciar sesión
              </Link>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                Ministerio Juvenil GDF 🔥
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}