"use client"

import { Inscripcion } from "@/shared/types/supabase.types";
import { useParams } from "next/navigation"
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect, useMemo } from "react";
import { useInscripcionesStore } from "@/lib/store/inscripciones.store";
import { CheckCircle2Icon, InfoIcon, PlaneIcon, XCircleIcon } from "lucide-react";

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

  const totalPaymentsAmount = useMemo(() => {
    if (!inscripcionData) return 0;
    return inscripcionData?.payments?.reduce((total, payment) => total + (payment.payment_amount || 0), 0);
  }, [inscripcionData?.payments]);

  const totalPaymentsVerified: boolean = useMemo(() => {
    return inscripcionData?.payments?.every((payment) => payment.payment_checked) ?? false;
  }, [inscripcionData?.payments]);


  console.log(inscripcionData)

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
              <p className="text-2xl font-bold text-gray-900 text-center">TICKET</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {inscripcionData.name}
                  </p>
                  <p className="text-xs text-gray-400 tracking-wide mb-1">Costo total: S/ {inscripcionData.price_amount}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">DNI</p>
                  <p className="text-lg font-bold text-sky-600 font-mono">
                    {inscripcionData.dni}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Pago</p>
                <div className="flex gap-2">
                  {totalPaymentsAmount === inscripcionData?.price_amount ? (
                    <div className="inline-flex items-center gap-1 mt-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      <CheckCircle2Icon size={12} />
                      Pagado completo
                    </div>
                  ) : (
                    <div className="flex flex-col gap-px">
                      <div className="inline-flex items-center gap-1 mt-1 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                        <XCircleIcon size={12} />
                        Pago incompleto
                      </div>
                      <div className="flex flex-col gap-px px-2 text-gray-400 text-xs">
                        <span>Pagado: S/ {totalPaymentsAmount},</span>
                        <span>Saldo: S/ {(inscripcionData?.price_amount || 0) - (totalPaymentsAmount || 0)}</span>
                      </div>
                    </div>
                  )}

                  {
                    totalPaymentsVerified ? (
                      <div className="h-fit flex items-center gap-1 mt-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        <CheckCircle2Icon size={12} />
                        Pagado verificado
                      </div>
                    ) : (
                      <div className="h-fit flex items-center gap-1 mt-1 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                        <XCircleIcon size={12} />
                        Pago por verificar
                      </div>
                    )
                  }

                </div>
              </div>

              {/* Event Details */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">CAMPAMENTO DESAFÍO</p>
                    <p className="text-sm text-gray-500">Verano 2026</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                      <PlaneIcon className="text-white" />
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

              {/* Pago and Date Info */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Inscripción</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {inscripcionData.created_at ? formatDate(inscripcionData.created_at) : '-'}
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