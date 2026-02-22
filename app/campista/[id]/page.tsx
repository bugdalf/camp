"use client"

import { Inscripcion } from "@/shared/types/supabase.types";
import { useParams } from "next/navigation"
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect, useMemo } from "react";
import { useInscripcionesStore } from "@/lib/store/inscripciones.store";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const Field = ({ label, value, large = false, accent = false }: {
  label: string;
  value?: string | number | null;
  large?: boolean;
  accent?: boolean;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
    {large ? (
      <span className={`text-4xl font-black tracking-tight leading-none ${accent ? 'text-blue-700' : 'text-gray-900'}`}>
        {value ?? <span className="text-gray-300">—</span>}
      </span>
    ) : (
      <span className={`text-sm font-semibold ${accent ? 'text-blue-700' : 'text-gray-800'}`}>
        {value ?? <span className="text-gray-300">—</span>}
      </span>
    )}
  </div>
);

export default function CampistaPage() {
  const { id } = useParams();
  const [inscripcionData, setInscripcionData] = useState<Inscripcion | null>(null);
  const { fetchInscripcionById } = useInscripcionesStore();

  useEffect(() => {
    if (id) {
      const idString = Array.isArray(id) ? id[0] : id;
      fetchInscripcionById(idString).then(setInscripcionData);
    }
  }, [id]);

  const totalPaymentsAmount = useMemo(() => {
    if (!inscripcionData) return 0;
    return inscripcionData?.payments?.reduce((total, p) => total + (p.payment_amount || 0), 0);
  }, [inscripcionData?.payments]);

  const totalPaymentsVerified = useMemo(() => {
    return inscripcionData?.payments?.every((p) => p.payment_checked) ?? false;
  }, [inscripcionData?.payments]);

  const isPaid = inscripcionData && totalPaymentsAmount === inscripcionData.price_amount;
  const saldo = (inscripcionData?.price_amount || 0) - (totalPaymentsAmount || 0);

  if (!inscripcionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium tracking-wide">Buscando inscripción...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">

        {/* === MAIN TICKET === */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header strip */}
          <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-blue-200 font-semibold tracking-widest uppercase">Nº de orden</p>
              <p className="text-xs text-white font-mono font-bold tracking-wider">
                {inscripcionData.id?.toUpperCase().slice(0, 16) ?? '—'}
              </p>
            </div>
            <div className="w-20">
              <img src="/main-logo.webp" alt="Logo" width={100} height={100} />
            </div>
          </div>

          {/* Passenger name */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Campista</p>
            <p className="text-xl font-black text-gray-900 leading-tight">
              {inscripcionData.name ?? <span className="text-gray-300">—</span>}
            </p>
            {inscripcionData.dni && (
              <p className="text-xs text-gray-400 font-mono mt-0.5">DNI: {inscripcionData.dni}</p>
            )}
          </div>

          {/* Route section */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Desde</span>
              <span className="text-5xl font-black text-gray-900 leading-none tracking-tight">JUL</span>
              <span className="text-xs text-gray-400 mt-0.5">Juliaca</span>
            </div>

            <div className="flex flex-col items-center gap-1 flex-1 px-4">
              <div className="flex items-center gap-1 w-full">
                <div className="flex-1 border-t border-dashed border-gray-300" />
                <span className="text-lg">✈️</span>
                <div className="flex-1 border-t border-dashed border-gray-300" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">CAMPAMENTO 2026</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Destino</span>
              <span className="text-5xl font-black text-blue-700 leading-none tracking-tight">CAM</span>
              <span className="text-xs text-gray-400 mt-0.5">Campamento</span>
            </div>
          </div>

          <div className="px-5 py-2 bg-gray-50 flex flex-col items-center">
            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200">
              <QRCodeSVG
                value={inscripcionData.id || ""}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-[10px] font-mono text-gray-400 tracking-widest text-center">
              {inscripcionData.id?.toUpperCase()}
            </p>
          </div>


          {/* Info grid */}
          <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-gray-100">
            <Field label="Edad" value={inscripcionData.age ? `${inscripcionData.age} años` : null} />
            <Field label="Celular" value={inscripcionData.cellphone_number} />
            <Field label="Inscripción" value={inscripcionData.created_at ? formatDate(inscripcionData.created_at) : null} />
          </div>

          {/* Payment section */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Estado de pago</p>

            {/* Amount row */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-black text-gray-900">S/ {totalPaymentsAmount ?? '0'}</span>
              <span className="text-sm text-gray-400">/ S/ {inscripcionData.price_amount ?? '—'}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isPaid ? 'bg-green-500' : 'bg-amber-400'}`}
                style={{ width: `${Math.min(100, ((totalPaymentsAmount || 0) / (inscripcionData.price_amount || 1)) * 100)}%` }}
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {isPaid ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                  <CheckCircle2 size={11} /> Pagado completo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full">
                  <AlertCircle size={11} /> Saldo S/ {saldo}
                </span>
              )}

              {totalPaymentsVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                  <CheckCircle2 size={11} /> Verificado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-50 text-gray-500 border border-gray-200 px-2 py-1 rounded-full">
                  <Clock size={11} /> Por verificar
                </span>
              )}
            </div>
          </div>

          {/* Responsable (if minor) */}
          {inscripcionData.is_under_18 && (
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-1">Responsable</p>
              <p className="text-sm font-semibold text-gray-800">
                {inscripcionData.parent_name ?? <span className="text-gray-300">—</span>}
              </p>
              {inscripcionData.parent_cellphone_number && (
                <p className="text-xs text-gray-500 mt-0.5">{inscripcionData.parent_cellphone_number}</p>
              )}
            </div>
          )}
          {/* Perforated divider */}
          <div className="relative flex items-center my-0">
            <div className="absolute -left-6 w-12 h-12 bg-gray-100 rounded-full z-10" />
            <div className="absolute -right-6 w-12 h-12 bg-gray-100 rounded-full z-10" />
            <div className="w-full border-t-2 border-dashed border-gray-200 mx-3" />
          </div>

          {/* Embarque section */}
          <div className="px-5 py-4 bg-blue-700 border-b border-blue-600">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200 mb-1">En puerta de embarque</p>
                <p className="text-3xl font-black text-white leading-none">04:00 PM</p>
                <p className="text-sm text-blue-200 font-medium mt-0.5">22 FEB 2026</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200 mb-1">Punto de encuentro</p>
                <a
                  href="https://maps.app.goo.gl/3CK1wmXVNmgXagom8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white text-blue-700 text-xs font-bold px-3 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Ver en Maps
                </a>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200 mb-1">Colegio Federico More Av. Ferrocarril #331</p>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="h-2 bg-blue-700" />
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-4">Campamento Desafío 2026</p>
        <p className="text-center text-[11px] text-gray-400">Hecho con 🕊️ - Generación de fuego</p>
      </div>
    </div>
  );
}
