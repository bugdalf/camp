"use client"

import { Inscripcion } from "@/shared/types/supabase.types";
import { useParams } from "next/navigation"
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from "react";
import { useInscripcionesStore } from "@/lib/store/inscripciones.store";

// Date formatting utility
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function CampistaPage() {
  const { id } = useParams();
  const [inscripcionData, setInscripcionData] = useState<Inscripcion | null>(null);

  const { fetchInscripcionById } = useInscripcionesStore();

  useEffect(() => {
    if (id) {
      const idString = Array.isArray(id) ? id[0] : id;
      fetchInscripcionById(idString).then((data) => {
        setInscripcionData(data);
      });
    }
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {!inscripcionData ? (
        <div className="text-white text-lg">
          Buscando inscripción...
        </div>
      ) : (
        <div className="relative w-full max-w-md">
          {/* Ticket Container */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Decorative stripes at top */}
            <div className="h-3 bg-linear-to-r from-sky-400 via-blue-500 to-sky-400 flex">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
                  style={{ transform: 'skewX(-20deg)' }}
                />
              ))}
            </div>

            {/* Top Section */}
            <div className="p-6 pb-4">
              {/* Header */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Campista</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {inscripcionData.name}
                  </p>
                  {inscripcionData.dni && (
                    <p className="text-xs text-gray-500 mt-1">DNI: {inscripcionData.dni}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Código</p>
                  <p className="text-lg font-bold text-sky-600 font-mono">
                    {inscripcionData.id?.slice(0, 6).toUpperCase()}
                  </p>
                  {inscripcionData.payment_checked ? (
                    <div className="inline-flex items-center gap-1 mt-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Pagado
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 mt-1 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Pago por verificar
                    </div>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">CAMPAMENTO</p>
                    <p className="text-sm text-gray-500">Verano 2026</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participant Details Grid */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Edad</p>
                  <p className="text-base font-semibold text-gray-900">
                    {inscripcionData.age || '-'} años
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Celular</p>
                  <p className="text-base font-semibold text-gray-900">
                    {inscripcionData.cellphone_number || '-'}
                  </p>
                </div>
              </div>

              {/* Parent/Guardian Info (if minor) */}
              {inscripcionData.is_under_18 && inscripcionData.parent_name && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700 uppercase tracking-wide mb-2 font-semibold">
                    Responsable
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{inscripcionData.parent_name}</p>
                    {inscripcionData.parent_cellphone_number && (
                      <p className="text-sm text-gray-600">{inscripcionData.parent_cellphone_number}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment and Date Info */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Inscripción</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {inscripcionData.created_at ? formatDate(inscripcionData.created_at) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Pago</p>
                  <p className="text-sm font-semibold text-sky-600 uppercase">
                    {inscripcionData.payment_method === 'yape' ? '💳 Yape' :
                      inscripcionData.payment_method === 'efectivo' ? '💵 Efectivo' : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Perforated divider */}
            <div className="relative h-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-linear-to-brrom-sky-400 via-blue-500 to-indigo-600 rounded-full"></div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 rounded-full"></div>
            </div>

            {/* Bottom Section - QR Code */}
            <div className="p-6 pt-4 bg-gray-50">
              <p className="text-sm text-gray-600 text-center mb-4 font-medium">
                Presenta este código QR en el ingreso
              </p>

              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-gray-200">
                  <QRCodeSVG
                    value={inscripcionData.id || ""}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 font-mono mt-2 tracking-wider">
                {inscripcionData.id?.toUpperCase()}
              </p>

              {/* Status badge */}
              {inscripcionData.is_active && (
                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm px-4 py-2 rounded-full font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Inscripción Activa
                  </div>
                </div>
              )}
            </div>

            {/* Decorative stripes at bottom */}
            <div className="h-3 bg-linear-to-r from-sky-400 via-blue-500 to-sky-400 flex">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
                  style={{ transform: 'skewX(-20deg)' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}