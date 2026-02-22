"use client"

import { Voluntario } from "@/shared/types/supabase.types";
import { useParams } from "next/navigation"
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from "react";
import { useVoluntariosStore } from "@/lib/store/voluntarios.store";
import { CheckCircle2, Clock, Zap } from "lucide-react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const COMMISSIONS: Record<string, { text: string; icon: string; code: string }> = {
  'logistica': { text: 'Logística', icon: '👩🏻‍💻', code: 'LOG' },
  'recepcion': { text: 'Recepción', icon: '👋🏻', code: 'REC' },
  'programacion-actividades': { text: 'Prog. y Actividades', icon: '📅', code: 'PRG' },
  'sonido-luces': { text: 'Sonido y Luces', icon: '🔊', code: 'SND' },
  'publicidad': { text: 'Publicidad', icon: '📸', code: 'PUB' },
  'alimentacion-limpieza': { text: 'Alimentación y Limpieza', icon: '🍽️', code: 'ALI' },
  'finanzas': { text: 'Finanzas', icon: '💰', code: 'FIN' },
  'atencion-pastores': { text: 'Atención Pastores', icon: '🙏', code: 'PAS' },
  'jueces': { text: 'Jueces', icon: '⚖️', code: 'JUE' },
  'contenido-digital': { text: 'Contenido Digital', icon: '📱', code: 'DIG' },
  'lideres-equipo': { text: 'Líderes de Equipo', icon: '🧗🏻‍♂️', code: 'LID' },
  'dinamicas-souvenires': { text: 'Dinámicas y Souvenires', icon: '🎁', code: 'DIN' },
  'salud': { text: 'Salud', icon: '🚑', code: 'SAL' },
};

const getCommission = (key?: string) =>
  COMMISSIONS[key as keyof typeof COMMISSIONS] ?? { text: 'Sin asignar', icon: '📋', code: 'N/A' };

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
    <span className="text-sm font-semibold text-gray-800">
      {value ?? <span className="text-gray-300">—</span>}
    </span>
  </div>
);

export default function VoluntarioPage() {
  const { id } = useParams();
  const [voluntarioData, setVoluntarioData] = useState<Voluntario | null>(null);
  const { fetchVoluntarioById } = useVoluntariosStore();

  useEffect(() => {
    if (id) {
      const idString = Array.isArray(id) ? id[0] : id;
      fetchVoluntarioById(idString).then(setVoluntarioData);
    }
  }, [id]);

  if (!voluntarioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium tracking-wide">Buscando voluntario...</span>
        </div>
      </div>
    );
  }

  const commission = getCommission(voluntarioData.commission);
  const paymentLabel = voluntarioData.payment_method === 'yape'
    ? 'Yape' : voluntarioData.payment_method === 'efectivo'
      ? 'Efectivo' : null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">

        {/* === MAIN TICKET === */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header strip — purple for volunteers */}
          <div className="bg-indigo-700 px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-indigo-200 font-semibold tracking-widest uppercase">Credencial</p>
              <p className="text-xs text-white font-mono font-bold tracking-wider">
                V-{voluntarioData.id?.slice(0, 12).toUpperCase() ?? '—'}
              </p>
            </div>
            <div className="w-20">
              <img src="/main-logo.webp" alt="Logo" width={100} height={100} />
            </div>
          </div>

          {/* Volunteer name */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Voluntario</p>
            <p className="text-xl font-black text-gray-900 leading-tight">
              {voluntarioData.name ?? <span className="text-gray-300">—</span>}
            </p>
            {voluntarioData.dni && (
              <p className="text-xs text-gray-400 font-mono mt-0.5">DNI: {voluntarioData.dni}</p>
            )}
          </div>

          {/* Commission — big boarding-pass style */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Comisión asignada</p>
            <div className="flex items-center gap-4">
              <span className="text-2xl leading-none">{commission.icon}</span>
              <p className="text-base font-bold text-gray-800 mt-1 leading-tight">{commission.text}</p>
            </div>
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
          {/* QR Section */}
          <div className="px-5 py-2 bg-gray-50 flex flex-col items-center">
            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200">
              <QRCodeSVG
                value={voluntarioData.id || ""}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-[10px] font-mono text-gray-400 tracking-widest text-center">
              {voluntarioData.id?.toUpperCase()}
            </p>
          </div>

          {/* Status + active indicator row */}
          <div className="px-5 py-3 flex items-center gap-2 border-b border-gray-100">
            {voluntarioData.payment_checked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                <CheckCircle2 size={11} /> Pago verificado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-50 text-gray-500 border border-gray-200 px-2 py-1 rounded-full">
                <Clock size={11} /> Pago por verificar
              </span>
            )}

            {voluntarioData.is_active && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-full">
                <Zap size={11} className="fill-indigo-400" /> Activo
              </span>
            )}
          </div>

          {/* Info grid */}
          <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-gray-100">
            <Field label="Edad" value={voluntarioData.age ? `${voluntarioData.age} años` : null} />
            <Field label="Celular" value={voluntarioData.cellphone_number} />
            <Field label="Aporte" value={paymentLabel} />
          </div>

          <div className="px-5 py-3 border-b border-gray-100">
            <Field label="Registro" value={voluntarioData.created_at ? formatDate(voluntarioData.created_at) : null} />
          </div>

          {/* Responsable (if minor) */}
          {voluntarioData.is_under_18 && (
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-1">Responsable</p>
              <p className="text-sm font-semibold text-gray-800">
                {voluntarioData.parent_name ?? <span className="text-gray-300">—</span>}
              </p>
              {voluntarioData.parent_cellphone_number && (
                <p className="text-xs text-gray-500 mt-0.5">{voluntarioData.parent_cellphone_number}</p>
              )}
            </div>
          )}

          {/* Perforated divider */}
          <div className="relative flex items-center my-0 mt-2">
            <div className="absolute -left-6 w-12 h-12 bg-gray-100 rounded-full z-10" />
            <div className="absolute -right-6 w-12 h-12 bg-gray-100 rounded-full z-10" />
            <div className="w-full border-t-2 border-dashed border-gray-200 mx-3" />
          </div>

          {/* Embarque section */}
          <div className="px-5 py-4 bg-indigo-700 border-b border-indigo-600">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200 mb-1">En puerta de embarque</p>
                <p className="text-3xl font-black text-white leading-none">04:00 PM</p>
                <p className="text-sm text-indigo-200 font-medium mt-0.5">22 FEB 2026</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200 mb-1">Punto de encuentro</p>
                <a
                  href="https://maps.app.goo.gl/3CK1wmXVNmgXagom8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white text-indigo-700 text-xs font-bold px-3 py-2 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Ver en Maps
                </a>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="h-2 bg-indigo-700" />
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-4">Campamento Desafío · Verano 2026</p>
      </div>
    </div>
  );
}
