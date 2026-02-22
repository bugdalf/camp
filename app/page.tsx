"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useInscripcionesStore } from "@/lib/store/inscripciones.store"
import { ChevronDownIcon } from "lucide-react"

export default function LandingPage() {
  const [inscripcionesCount, setInscripcionesCount] = useState<number>(0);
  const { fetchInscripcionesCount } = useInscripcionesStore();
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await fetchInscripcionesCount();
      setInscripcionesCount(count);
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleString("en-US", { timeZone: "America/Lima" });
    const todayPeru = new Date(today);
    const campDate = new Date("2026-02-22T00:00:00");

    const daysLeft = Math.ceil((campDate.getTime() - todayPeru.getTime()) / (1000 * 60 * 60 * 24));
    setDaysLeft(daysLeft);
  }, []);

  const scrollToVideo = () => {
    const videoSection = document.getElementById('video-section');
    videoSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#040810]">
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen py-8 flex flex-col justify-center items-center gap-2 bg-[url('/fondo.webp')] bg-cover bg-center bg-no-repeat mask-fade-bottom">
        {/* Fecha del evento */}
        <div className="animate-in fade-in slide-in-from-top-8 duration-700 delay-150">
          <div className="relative">
            {daysLeft > 0 && (
              <div className="relative text-white font-display text-xl px-2 py-0 bg-[#0f45af] border-3 border-black z-1">
                FALTAN
              </div>
            )}
            <div className="absolute top-1 -left-1 w-full h-full bg-black"></div>
          </div>
          <div className="flex justify-center items-end mt-2">
            {daysLeft > 0 ? (
              <div className="text-white font-display text-6xl text-outline-shadow">
                {daysLeft}
              </div>
            ) : (
              <div className="text-white font-display text-4xl text-outline-shadow">
                ¡Es hoy!
              </div>
            )}
            {daysLeft > 0 && (
              <div className="text-white font-display text-xs mb-3 transform -rotate-90">DIAS</div>
            )}
          </div>
        </div>


        {/* Logo principal */}
        <figure className="max-w-lg animate-in fade-in zoom-in duration-700 delay-300">
          <img
            src="/main-logo.webp"
            alt="Logo principal del campamento"
            className="w-full max-h-[220px] object-contain drop-shadow-2xl"
          />
        </figure>

        {/* Fecha */}
        <figure className="animate-in fade-in zoom-in duration-700 delay-300">
          <img
            src="/fecha.webp"
            alt="Fecha del evento"
            className="w-full max-h-[40px] object-contain drop-shadow-2xl"
          />
        </figure>

        {/* CTA + Precios */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="flex flex-col items-center font-display text-white">
            <span className="text-xs">Cupos Limitados:</span>
            <span className="text-xl">{inscripcionesCount}/200</span>
          </div>

          <Link href="/inscripcion-campista" className="flex flex-col items-center gap-2">
            <div className="relative shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <div className="relative text-black font-display text-xl px-3 py-1 bg-[#f9d303] border-3 border-black z-1">
                ¡Regístrate hoy!
              </div>
              <div className="absolute top-1 -left-1 w-full h-full bg-black"></div>
            </div>

            <p className="text-white font-bold text-xs">
              * Precio regular: S/ 220
            </p>
          </Link>
        </div>
        {/* === EMBARQUE SECTION === */}
        <section className="w-full px-4 py-6 pt-0">
          <div className="max-w-lg mx-auto">
            {/* Title */}
            {/* <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="relative text-black font-display text-2xl px-3 py-1 bg-white border-3 border-black z-10">
                  Información de embarque
                </div>
                <div className="absolute top-1 -left-1 w-full h-full bg-[#0f45af]"></div>
              </div>
            </div> */}

            {/* Card */}
            <div className="border-2 border-white/20 bg-[#0a1628] rounded-md overflow-hidden">
              {/* Top stripe */}
              <div className="h-1.5 flex">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#0f45af]' : 'bg-white/10'}`} style={{ transform: 'skewX(-15deg)' }} />
                ))}
              </div>

              <div className="p-6 flex items-center justify-between gap-4">
                {/* Left: time */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7aa0e0] mb-1">
                    En puerta de embarque
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-5xl font-display text-white leading-none">04:00</p>
                    <p className="text-2xl font-display text-[#f9d303] leading-none mb-0.5">PM</p>
                  </div>
                  <p className="text-sm text-[#7aa0e0] font-bold mt-1 tracking-widest">22 FEB 2026</p>
                </div>

                {/* Vertical dashed divider */}
                <div className="self-stretch border-l border-dashed border-white/20" />

                {/* Right: location */}
                <div className="flex flex-col items-end gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7aa0e0] mb-0.5 text-right">
                      Punto de encuentro
                    </p>

                    <p className="text-white/60 text-xs text-right">Colegio Federico More Av. Ferrocarril #331</p>
                    <p className="text-white/60 text-xs text-right">Ver la ubicación exacta<br />en Google Maps</p>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/3CK1wmXVNmgXagom8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                  >
                    <div className="relative flex items-center gap-2 text-black font-display text-sm px-4 py-2 bg-[#f9d303] border-2 border-black z-10 group-hover:bg-yellow-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Ver en Maps
                    </div>
                    <div className="absolute top-1 -left-1 w-full h-full bg-black z-0"></div>
                  </a>
                </div>
              </div>

              {/* Bottom stripe */}
              <div className="h-1.5 flex">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#0f45af]' : 'bg-white/10'}`} style={{ transform: 'skewX(-15deg)' }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scroll to Video Button */}
        <button
          onClick={scrollToVideo}
          className="flex flex-col items-center text-white mt-2 mb-8 animate-in fade-in slide-in-from-bottom-4 hover:text-amber-400 transition-colors duration-300 cursor-pointer group"
        >
          <ChevronDownIcon size={40} className="animate-bounce group-hover:scale-110 transition-transform" />
        </button>
      </section>

      {/* Video Section */}
      <section id="video-section" className="w-full p-4 scroll-mt-4">
        <h2 className="text-white font-display text-4xl text-center mb-8">Vive la Experiencia</h2>
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full aspect-video overflow-hidden rounded-md border-2 border-[#0f45af] animate-in fade-in zoom-in duration-700">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/Xpw1UExgyaQ"
              title="Campamento Desafío 2026"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section id="redes" className="w-full p-4 scroll-mt-4">
        <div className="relative w-fit mx-auto">
          <div className="relative text-black text-2xl px-2 py-2 font-bold bg-[#f9d303] border-3 border-black z-1">
            Atención pasajeros
          </div>
          <div className="absolute top-1 -left-1 w-full h-full bg-black"></div>
        </div>
        <div className="max-w-lg mt-2 mx-auto h-1 bg-[#040810] flex">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
              style={{ transform: 'skewX(-10deg)' }}
            />
          ))}
        </div>
        <div className="max-w-xl mt-2 mx-auto relative ">
          <figure className="w-full aspect-video rounded-md overflow-hidden">
            <img src="/foto-camp-01.webp" alt="Redes Sociales" className="w-full h-full object-cover" />
          </figure>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 text-white flex flex-col items-center justify-center bg-[#052c79] rounded-md">
            <span>Se anuncia un vuelo que puede </span>
            <span className="font-bold">CAMBIAR TU DESTINO...</span>
          </div>
        </div>

        <div>
          asdf
        </div>
        <h2 className="text-white font-extrabold text-2xl text-center mt-12">No te lo pierdas</h2>
        <p className="text-white text-center">Síguenos y activa las notificaciones</p>

        <div className="flex justify-center items-center gap-4 mt-2">
          <Link href="https://www.tiktok.com/@campdesafiojuliaca" target="_blank" className="flex items-center gap-2 hover:scale-110 transition-all duration-300">
            <img src="/icons/tiktok.svg" alt="Tiktok" className="w-6 h-6" />
          </Link>
          <Link href="https://www.facebook.com/p/Campamento-Desafio-61555802805341/" target="_blank" className="flex items-center gap-2 hover:scale-110 transition-all duration-300">
            <img src="/icons/facebook.webp" alt="Facebook" className="w-6 h-6" />
          </Link>
          <Link href="https://www.instagram.com/campdesafiojuliaca/" target="_blank" className="flex items-center gap-2 hover:scale-110 transition-all duration-300">
            <img src="/icons/instagram.webp" alt="Instagram" className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center text-xs">
            <p className="text-white font-semibold">Campamento desafío 2026 - La Última llamada</p>
            <p className="text-slate-400">Hecho con 🔥 por Ministerio Juvenil Generación de fuego</p>
            <Link href="/login">
              <Button variant='link' className="text-slate-200 hover:text-white transition-all duration-300">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}