"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Booking } from "@/types/booking";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CONFIRMED" | "CANCELLED">("ALL");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      setFeedback({ type: "error", text: "No se pudieron cargar tus reservas." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }

    setCancellingId(id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "No se pudo cancelar la reserva." });
        return;
      }

      setFeedback({ type: "success", text: "Reserva cancelada exitosamente." });
      // Actualizar estado local
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
    } catch {
      setFeedback({ type: "error", text: "Error de conexión al cancelar la reserva." });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] text-xs font-bold uppercase tracking-wider mb-2">
            Gestión Personal
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight">
            Mis Reservas
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Revisa el estado de tus reservas de espacios de trabajo y administra cancelaciones.
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-[#6D28D9] hover:bg-[#5B21B6] transition-all shadow-md shadow-purple-600/20"
        >
          + Explorar Más Espacios
        </Link>
      </div>

      {/* Alerta de feedback */}
      {feedback && (
        <div
          className={`p-4 text-xs sm:text-sm rounded-2xl border flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline ml-4 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Filtro por Estado */}
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-4">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            statusFilter === "ALL"
              ? "bg-[#6D28D9] text-white shadow-xs"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          Todas ({bookings.length})
        </button>
        <button
          onClick={() => setStatusFilter("CONFIRMED")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            statusFilter === "CONFIRMED"
              ? "bg-[#6D28D9] text-white shadow-xs"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          Confirmadas ({bookings.filter((b) => b.status === "CONFIRMED").length})
        </button>
        <button
          onClick={() => setStatusFilter("CANCELLED")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            statusFilter === "CANCELLED"
              ? "bg-[#6D28D9] text-white shadow-xs"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          Canceladas ({bookings.filter((b) => b.status === "CANCELLED").length})
        </button>
      </div>

      {/* Lista de Reservas Responsiva */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 h-32 animate-pulse"
            />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
          <p className="text-sm font-bold text-gray-600 dark:text-slate-400">
            No se encontraron reservas con el filtro seleccionado.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block px-4 py-2 text-xs font-bold text-[#6D28D9] dark:text-[#A78BFA] hover:underline"
          >
            Reservar un nuevo espacio &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);

            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-[#1E293B] p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Espacio y detalles de tiempo */}
                <div className="flex items-start gap-4">
                  {booking.space?.imageUrl && (
                    <div className="hidden sm:block w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={booking.space.imageUrl}
                        alt={booking.space.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#111827] dark:text-white">
                        {booking.space?.name || "Espacio Coworking"}
                      </h3>
                      {booking.space?.type && (
                        <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                          {booking.space.type}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                      📅 {start.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      ⏰ {start.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })} -{" "}
                      {end.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })} ({booking.totalHours} hr{booking.totalHours > 1 ? "s" : ""})
                    </p>
                  </div>
                </div>

                {/* Precios, Estados y Acción */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400 block">
                      Total Pagado / Acordado
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#111827] dark:text-white">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(booking.totalPrice)}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-full shrink-0 ${
                      booking.status === "CONFIRMED"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {booking.status === "CONFIRMED" ? "Confirmada" : "Cancelada"}
                  </span>

                  {booking.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="px-3.5 py-2 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 rounded-xl border border-red-200 dark:border-red-900 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {cancellingId === booking.id ? "Cancelando..." : "Cancelar Reserva"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
