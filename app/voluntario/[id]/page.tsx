"use client"

import { Voluntario } from "@/shared/types/supabase.types";
import { useParams } from "next/navigation"
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from "react";
import { useVoluntariosStore } from "@/lib/store/voluntarios.store";
import { format } from "date-fns";


export default function VoluntarioPage() {
  const { id } = useParams();
  const [voluntarioData, setVoluntarioData] = useState<Voluntario | null>(null);

  const { fetchVoluntarioById } = useVoluntariosStore();

  useEffect(() => {
    if (id) {
      const idString = Array.isArray(id) ? id[0] : id;
      fetchVoluntarioById(idString).then((data) => {
        setVoluntarioData(data);
      });
    }
  }, [id]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-linear-to-br from-sky-500 to-blue-700 p-6">
      {!voluntarioData ? (
        <div className="text-white">
          Buscando voluntario...
        </div>)
        : (
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-sky-600 text-white text-center py-6">
              <h1 className="font-display text-3xl">Campamento 2026</h1>
              <p className='mt-2 text-lg font-semibold'>
                {voluntarioData.name}
              </p>
            </div>

            {/* Cuerpo */}
            <div className="p-6 flex flex-col items-center gap-4">
              <p className="text-gray-600 text-sm text-center">
                Presenta este código QR en el ingreso
              </p>

              <div className="bg-white p-3 rounded-xl border">
                <QRCodeSVG
                  value={voluntarioData.id || ""}
                  size={200}
                  level="H"
                />
              </div>
              <span className="font-mono text-xs text-sky-300">
                {voluntarioData.id}
              </span>
              <div>
                <p className='text-xs text-gray-500'>fecha de inscripcion:</p>
                <p className='font-semibold text-sky-700 text-sm'>
                  {voluntarioData.created_at ? format(voluntarioData.created_at, 'dd/MM/yyyy') : '-'}
                </p>
              </div>
            </div>

            {/* Línea punteada */}
            <div className="border-t border-dashed border-gray-300 mx-6" />


            {/* Footer */}
            <div className="p-4 text-center space-y-4">
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-sky-500 rounded-full" />
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-sky-500 rounded-full" />
            </div>
          </div>
        )}
    </div>
  )
}
