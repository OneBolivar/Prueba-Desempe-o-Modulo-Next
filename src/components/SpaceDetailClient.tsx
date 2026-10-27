"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Space } from "@/types/space";

interface SpaceDetailClientProps {
  space: Space;
}

export function SpaceDetailClient({ space }: SpaceDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Fechas por defecto: Mañana a las 09:00 y 11:00
  const getDefaultDates = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const end = new Date(tomorrow);
    end.setHours(11, 0, 0, 0);

    const formatForInput = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return {
      start: formatForInput(tomorrow),
      end: formatForInput(end),
    };
  };

  const initialDates = getDefaultDates();
  const [startTime, setStartTime] = useState(initialDates.start);
  const [endTime, setEndTime] = useState(initialDates.end);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cálculo de horas y precio total dinámicamente
  const { totalHours, totalPrice, isValidDuration, durationError } = useMemo(() => {
    if (!startTime || !endTime) {
      return { totalHours: 0, totalPrice: 0, isValidDuration: false, durationError: "Selecciona las fechas." };
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { totalHours: 0, totalPrice: 0, isValidDuration: false, durationError: "Fechas inválidas." };
    }

    if (start < now) {
      return { totalHours: 0, totalPrice: 0, isValidDuration: false, durationError: "La fecha inicial no puede estar en el pasado." };
    }

    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) {
      return { totalHours: 0, totalPrice: 0, isValidDuration: false, durationError: "La fecha de fin debe ser posterior a la de inicio." };
    }

    const hours = diffMs / (1000 * 60 * 60);
    if (hours < 1) {
      return { totalHours: 0, totalPrice: 0, isValidDuration: false, durationError: "La reserva mínima es de 1 hora." };
    }

    const roundedHours = Math.ceil(hours);
    const calculatedPrice = roundedHours * space.pricePerHour;

    return {
      totalHours: roundedHours,
      totalPrice: calculatedPrice,
      isValidDuration: true,
      durationError: null,
    };
  }, [startTime, endTime, space.pricePerHour]);

  const formattedHourlyRate = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(space.pricePerHour);

  const formattedTotalPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(totalPrice);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!user) {
      router.push(`/login?from=/spaces/${space.id}`);
      return;
    }

    if (!isValidDuration) {
      setErrorMessage(durationError || "Por favor, revisa el rango horario seleccionado.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId: space.id,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "No fue posible crear la reserva.");
        return;
      }

      setSuccessMessage("¡Reserva confirmada exitosamente! Tu espacio está reservado.");
    } catch {
      setErrorMessage("Error de conexión al procesar la reserva. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
      {/* Breadcrumb / Navegación Superior */}
      <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-slate-400">
        <Link href="/" className="hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/" className="hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] transition-colors">
          Espacios
        </Link>
        <span>/</span>
        <span className="text-[#111827] dark:text-white font-bold truncate max-w-xs">{space.name}</span>
      </div>

      {/* Grid Responsivo de Detalle (1 columna en móvil, 12 columnas en escritorio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Columna Izquierda: Información, Imagen y Especificaciones (7 columnas en desktop) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={space.imageUrl}
              alt={space.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-[#111827]/80 dark:bg-black/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                {space.type}
              </span>
            </div>
            {!space.isActive && (
              <div className="absolute top-4 right-4 bg-red-600/90 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                No disponible temporalmente
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight">
                {space.name}
              </h1>
              <span className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA]">
                Capacidad: {space.capacity} {space.capacity === 1 ? "persona" : "personas"}
              </span>
            </div>

            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed font-normal">
              {space.description}
            </p>
          </div>

          {/* Comodidades y Características */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827] dark:text-white">
              Servicios incluidos en este espacio
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6D28D9] dark:bg-[#8B5CF6]" />
                WiFi 500 Mbps
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6D28D9] dark:bg-[#8B5CF6]" />
                Café y Té ilimitado
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6D28D9] dark:bg-[#8B5CF6]" />
                Tomas eléctricas
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6D28D9] dark:bg-[#8B5CF6]" />
                Aire Acondicionado
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6D28D9] dark:bg-[#8B5CF6]" />
                Soporte en recepción
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6D28D9] dark:bg-[#8B5CF6]" />
                Acceso con cerradura
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel Fijo de Selección Horaria y Reserva (5 columnas en desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b border-gray-100 dark:border-slate-800 pb-5 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400 block">
                  Tarifa por hora
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-white">
                  {formattedHourlyRate}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400">
                COP / hora
              </span>
            </div>

            {/* Mensaje de Error */}
            {errorMessage && (
              <div className="p-3.5 text-xs sm:text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl flex items-start gap-2">
                <span className="font-bold">Error:</span> {errorMessage}
              </div>
            )}

            {/* Mensaje de Éxito */}
            {successMessage && (
              <div className="p-4 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
                <p className="font-bold">{successMessage}</p>
                <div className="flex gap-2">
                  <Link
                    href="/reservas"
                    className="inline-block px-4 py-2 text-xs font-bold bg-[#6D28D9] text-white rounded-xl hover:bg-[#5B21B6] transition-colors"
                  >
                    Ver Mis Reservas
                  </Link>
                  <Link
                    href="/"
                    className="inline-block px-4 py-2 text-xs font-bold bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Explorar más
                  </Link>
                </div>
              </div>
            )}

            {/* Formulario de Reserva */}
            {!successMessage && (
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Fecha y Hora de Inicio
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Fecha y Hora de Finalización
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all"
                  />
                </div>

                {/* Desglose dinámico de checkout */}
                <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-slate-300">
                    <span>Duración calculada:</span>
                    <span className="font-bold text-[#111827] dark:text-white">
                      {isValidDuration ? `${totalHours} hora${totalHours > 1 ? "s" : ""}` : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-slate-300">
                    <span>Tarifa unitaria:</span>
                    <span>{formattedHourlyRate} / hr</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-slate-700 flex justify-between items-baseline font-black text-sm sm:text-base">
                    <span className="text-[#111827] dark:text-white">Costo Total:</span>
                    <span className="text-[#6D28D9] dark:text-[#A78BFA] text-lg sm:text-xl">
                      {isValidDuration ? formattedTotalPrice : "$ 0 COP"}
                    </span>
                  </div>
                </div>

                {!user && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    * Serás dirigido a iniciar sesión antes de confirmar la reserva.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !isValidDuration || !space.isActive}
                  className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm sm:text-base bg-[#6D28D9] hover:bg-[#5B21B6] active:scale-98 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting
                    ? "Confirmando reserva..."
                    : !space.isActive
                    ? "Espacio Inactivo"
                    : user
                    ? "Confirmar Reserva Inmediata"
                    : "Iniciar Sesión para Reservar"}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <span className="text-[11px] text-gray-400 dark:text-slate-400 block font-medium">
                Sin cargos ocultos • Cancelación flexible hasta 1h antes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

