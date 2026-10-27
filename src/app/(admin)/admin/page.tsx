"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Booking } from "@/types/booking";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchAllBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      console.error("Error al cargar reservas de administrador");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const handleAdminCancel = async (id: string) => {
    if (!confirm("¿Deseas cancelar esta reserva como Administrador?")) return;

    setCancellingId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        setFeedback("Reserva cancelada exitosamente.");
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
        );
      } else {
        setFeedback(data.error || "No se pudo cancelar la reserva.");
      }
    } catch {
      setFeedback("Error al comunicarse con el servidor.");
    } finally {
      setCancellingId(null);
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1">
      {/* Cabecera Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] text-xs font-bold uppercase tracking-wider mb-2">
            Panel de Control Central
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight">
            Administración General
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Métricas de ocupación global, ingresos y auditoría de reservas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/spaces"
            className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-[#EC4899] hover:bg-[#DB2777] transition-all shadow-md shadow-pink-600/20"
          >
            Gestionar Espacios (CRUD)
          </Link>
          <Link
            href="/"
            className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-gray-700 dark:text-slate-200 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 text-xs sm:text-sm rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800 flex justify-between items-center">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-bold underline text-xs cursor-pointer">
            Cerrar
          </button>
        </div>
      )}

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block">
            Ingresos Totales Brutos
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#6D28D9] dark:text-[#A78BFA] mt-2">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            }).format(totalRevenue)}
          </p>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
            En reservas confirmadas
          </span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block">
            Total Reservas Registradas
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-white mt-2">
            {bookings.length}
          </p>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
            Todas las operaciones
          </span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block">
            Confirmadas / Válidas
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {confirmedCount}
          </p>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
            {bookings.length > 0
              ? `${Math.round((confirmedCount / bookings.length) * 100)}% de efectividad`
              : "0%"}
          </span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block">
            Cancelaciones
          </span>
          <p className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 mt-2">
            {cancelledCount}
          </p>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
            Liberadas para re-reserva
          </span>
        </div>
      </div>

      {/* Tabla / Lista de Todas las Reservas */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-lg font-black text-[#111827] dark:text-white">
          Registro Maestro de Reservas de Usuarios
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center py-10 text-sm font-semibold text-gray-500 dark:text-slate-400">
            No existen reservas registradas en el sistema todavía.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Usuario</th>
                  <th className="py-3 px-3">Espacio</th>
                  <th className="py-3 px-3">Horario</th>
                  <th className="py-3 px-3">Duración</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-[#111827] dark:text-white">{b.user?.name || "Desconocido"}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-400">{b.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-[#111827] dark:text-white">{b.space?.name}</p>
                      <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase">{b.space?.type}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 dark:text-slate-300">
                      {new Date(b.startTime).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })} •{" "}
                      {new Date(b.startTime).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 dark:text-slate-300">
                      {b.totalHours} hr{b.totalHours > 1 ? "s" : ""}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#111827] dark:text-white">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(b.totalPrice)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase rounded-full ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                            : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {b.status === "CONFIRMED" ? "Confirmada" : "Cancelada"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {b.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleAdminCancel(b.id)}
                          disabled={cancellingId === b.id}
                          className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-200 dark:border-red-900 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {cancellingId === b.id ? "..." : "Anular"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
