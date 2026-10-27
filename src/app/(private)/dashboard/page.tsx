"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Booking } from "@/types/booking";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error("Error al cargar reservas en dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-28 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-28 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  const activeBookingsCount = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.endTime) >= new Date()
  ).length;

  const totalSpent = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const formattedSpent = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(totalSpent);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1">
      {/* Bienvenida */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] text-xs font-bold uppercase tracking-wider mb-2">
            Panel de Usuario
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight">
            Hola, {user?.name || "Colega"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Gestiona tu actividad, próximas reservas y presupuesto de espacios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-[#6D28D9] hover:bg-[#5B21B6] transition-all shadow-md shadow-purple-600/20"
          >
            + Nueva Reserva
          </Link>
          <Link
            href="/reservas"
            className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-gray-700 dark:text-slate-200 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            Mis Reservas
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas de Usuario */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block">
            Reservas Activas / Próximas
          </span>
          <p className="text-3xl font-black text-[#6D28D9] dark:text-[#A78BFA] mt-2">
            {activeBookingsCount}
          </p>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
            En horario vigente o futuro
          </span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block">
            Histórico Total de Reservas
          </span>
          <p className="text-3xl font-black text-[#111827] dark:text-white mt-2">
            {bookings.length}
          </p>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
            Registradas en la plataforma
          </span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block">
            Inversión Acumulada
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#EC4899] dark:text-[#F472B6] mt-2">
            {formattedSpent}
          </p>
          <span className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
            Reservas confirmadas
          </span>
        </div>
      </div>

      {/* Accesos rápidos y Próximas reservas */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#111827] dark:text-white">
            Reservas Recientes
          </h2>
          <Link
            href="/reservas"
            className="text-xs font-bold text-[#6D28D9] dark:text-[#A78BFA] hover:underline"
          >
            Ver todas las reservas &rarr;
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
            <p className="text-sm font-semibold text-gray-600 dark:text-slate-400">
              Aún no tienes reservas realizadas.
            </p>
            <Link
              href="/"
              className="mt-3 inline-block px-4 py-2 text-xs font-bold text-white bg-[#6D28D9] rounded-xl hover:bg-[#5B21B6]"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#111827] dark:text-white">
                    {b.space?.name || "Espacio de Coworking"}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    {new Date(b.startTime).toLocaleString("es-CO", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    -{" "}
                    {new Date(b.endTime).toLocaleTimeString("es-CO", {
                      timeStyle: "short",
                    })}{" "}
                    ({b.totalHours} hr{b.totalHours > 1 ? "s" : ""})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-full ${
                      b.status === "CONFIRMED"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {b.status === "CONFIRMED" ? "Confirmada" : "Cancelada"}
                  </span>
                  <span className="text-sm font-black text-[#111827] dark:text-white">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(b.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

