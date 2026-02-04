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
  const today = new Date();
  const campDate = new Date("2026-02-22");

  useEffect(() => {
    const fetchCount = async () => {
      const count = await fetchInscripcionesCount();
      setInscripcionesCount(count);
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const daysLeft = Math.floor((campDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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
            <div className="relative text-white font-display text-xl px-2 py-0 bg-[#0f45af] border-3 border-black z-1">
              FALTAN
            </div>
            <div className="absolute top-1 -left-1 w-full h-full bg-black"></div>
          </div>
          <div className="flex items-end mt-2">
            <div className="text-white font-display text-6xl text-outline-shadow">
              {daysLeft}
            </div>
            <div className="text-white font-display text-xs mb-3 transform -rotate-90">DIAS</div>
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
              * Preventa: S/ 190 hasta el 8 de febrero
            </p>
          </Link>
        </div>

        {/* Scroll to Video Button */}
        <button
          onClick={scrollToVideo}
          className="flex flex-col items-center text-white mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 hover:text-amber-400 transition-colors duration-300 cursor-pointer group"
        >
          <ChevronDownIcon size={40} className="animate-bounce group-hover:scale-110 transition-transform" />
        </button>
      </section>

      {/* Video Section */}
      <section id="video-section" className="w-full p-4 scroll-mt-4">
        <h2 className="text-white font-display text-4xl text-center mb-8">Vive la Experiencia</h2>
        <div className="max-w-5xl mx-auto">
          {/* Video Container - Responsive */}
          <div className="relative w-full aspect-video overflow-hidden rounded-md border-2 border-[#0f45af] animate-in fade-in zoom-in duration-700">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/Xpw1UExgyaQ"
              title="Campamento Desafío 2026"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture "
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