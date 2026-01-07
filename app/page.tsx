"use client"

import { teams } from "@/lib/constants/teams"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TeamsGrid from "@/components/own/landing/teams-grid"
import { useState, useMemo } from "react"

export default function LandingPage() {
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);

  // Encuentra el equipo actualmente hovered
  const currentTeam = useMemo(() => {
    return hoveredTeam
      ? teams.find(team => team.name === hoveredTeam)
      : null;
  }, [hoveredTeam]);

  console.log(currentTeam)

  return (
    <>
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen w-full flex flex-col items-center px-4 bg-slate-950">
        <div className="w-full h-screen flex flex-col items-center gap-8 relative">
          <p className="font-display text-xl md:text-2xl text-white text-center p-3">
            22 al 26 FEBRERO
          </p>
          {/* Título y Logo - Dinámico según hover */}
          <div className="w-full h-full flex flex-col items-center gap-6">
            {/* Contenedor de imágenes con altura fija para evitar saltos */}
            <figure className="w-full max-w-lg relative flex items-center justify-center h-2/3">
              {/* Logo principal (por defecto) */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${currentTeam ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
              >
                <img
                  src="/main-logo.png"
                  alt="Logo del evento"
                  className="w-full h-auto max-h-[300px] object-contain"
                />
              </div>

              {/* Imágenes dinámicas de los equipos */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${currentTeam ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
              >
                {currentTeam && (
                  <>
                    {/* Título del equipo en hover */}
                    {/* <img
                      src={currentTeam.titleHoverImg}
                      alt={`${currentTeam.name} título`}
                      className="w-full max-w-md h-auto object-contain"
                    /> */}
                    {/* Imagen del grupo */}
                    <img
                      src={currentTeam.groupImg}
                      alt={`${currentTeam.name} grupo`}
                      className="w-full max-w-sm h-auto object-contain"
                    />
                  </>
                )}
              </div>
            </figure>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-4 z-10 absolute bottom-[20%]">
            <p className="font-display text-xl md:text-2xl text-white">
              Cupos: 200/200
            </p>
            <Button variant="cta" size="cta">
              Regístrate hoy
            </Button>
          </div>

          {/* Grid de Equipos */}
          <TeamsGrid
            teams={teams}
            hoveredTeam={hoveredTeam}
            setHoveredTeam={setHoveredTeam}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Info del evento */}
            <div className="text-center md:text-left">
              <p className="text-white font-semibold mb-1">Evento Deportivo 2025</p>
              <p className="text-slate-400 text-sm">22 al 26 de Febrero</p>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-sm">
              <Link href="/contacto" className="text-slate-400 hover:text-white transition-colors">
                Contacto
              </Link>
              <Link href="/sobre-nosotros" className="text-slate-400 hover:text-white transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/bases" className="text-slate-400 hover:text-white transition-colors">
                Bases
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