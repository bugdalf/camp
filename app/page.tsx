"use client"

import { teams } from "@/lib/constants/teams"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TeamsGrid from "@/components/own/landing/teams-grid"
import { useState, useMemo, useEffect } from "react"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"

export default function LandingPage() {
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);
  const [inscripcionesCount, setInscripcionesCount] = useState<number>(0);
  const { fetchInscripcionesCount } = useInscripcionesStore();

  const currentTeam = useMemo(() => {
    return hoveredTeam
      ? teams.find(team => team.name === hoveredTeam)
      : null;
  }, [hoveredTeam]);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await fetchInscripcionesCount();
      console.log(count);
      setInscripcionesCount(count);
    };
    fetchCount();
  }, []);

  return (
    <>
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen w-full flex flex-col items-center px-4 bg-slate-950">
        <div className="w-full h-screen flex flex-col items-center gap-8 relative">
          {/* Imagen del campeón anterior con animación */}
          <div className="flex flex-col items-center gap-2 w-80 animate-in fade-in slide-in-from-top-4 duration-700 scale-60">
            <span className="strong text-white text-center">Ultimo campeón</span>
            <div className="w-full h-20 relative">
              <img src="/champ-aura.png" alt="" className="w-full h-20 object-cover object-center absolute" />
              <img src={teams[0].titleHoverImg} alt="" className="w-full absolute -top-15" />

            </div>
          </div>

          {/* Fecha del evento con animación */}
          <p className="font-display text-xl md:text-2xl text-white text-center p-3 animate-in fade-in slide-in-from-top-8 duration-700 delay-150">
            22 al 26 FEBRERO
          </p>

          {/* Título y Logo - Dinámico según hover */}
          <div className="w-full h-full flex flex-col items-center gap-6">
            {/* Contenedor de imágenes con altura fija */}
            <figure className="w-full max-w-lg relative flex items-center justify-center h-2/3">
              {/* Logo principal (por defecto) */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-8 transition-all duration-500 ${currentTeam ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
              >
                <div className="animate-in fade-in zoom-in duration-700 delay-300">
                  <img
                    src="/main-logo.png"
                    alt="Logo del evento"
                    className="w-full h-auto max-h-[300px] object-contain drop-shadow-2xl"
                  />
                </div>

                {/* CTA Section */}
                <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                  <p className="font-display md:text-2xl text-white">
                    Cupos Limitados: {inscripcionesCount}/200
                  </p>
                  <Link href="/inscripcion-campista">
                    <Button variant="cta" size="cta" className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      Regístrate ahora
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Imágenes dinámicas de los equipos */}
              <div
                className={`absolute flex justify-center items-center inset-0 transition-all duration-500 ${currentTeam ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
              >
                {currentTeam && (
                  <div className="w-169 h-160 relative flex flex-col items-center justify-center gap-4">
                    {/* Imagen del grupo con bordes redondeados */}
                    <figure className="w-full h-full absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={currentTeam.groupImg}
                        alt={`${currentTeam.name} grupo`}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                      {/* Gradiente sutil en los bordes */}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/30 via-transparent to-slate-950/30 pointer-events-none" />
                    </figure>

                    {/* Título del equipo en hover */}
                    <figure
                      className="
                        w-full h-50 -bottom-10 z-10 scale-150
                        animate-in fade-in slide-in-from-bottom-8 duration-500
                        absolute overflow-hidden
                      "
                    >
                      <img
                        src={currentTeam.titleHoverImg}
                        alt={`${currentTeam.name} título`}
                        className="w-full h-full object-cover drop-shadow-2xl"
                      />
                    </figure>
                  </div>
                )}
              </div>
            </figure>
          </div>

          {/* Grid de Equipos con animación */}
          {/* <TeamsGrid
            teams={teams}
            hoveredTeam={hoveredTeam}
            setHoveredTeam={setHoveredTeam}
          /> */}

        </div>
      </section>

      {/* Footer con animación */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Info del evento */}
            <div className="text-center md:text-left">
              <p className="text-white font-semibold mb-1">Campamento desafío 2026</p>
              <p className="text-slate-400 text-sm">22 al 26 de Febrero</p>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-sm">
              <Link href="/login" className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110">
                Iniciar sesión
              </Link>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/inscripcion-voluntario" className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110">
                ¿Quieres ser voluntario?
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2025 Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}