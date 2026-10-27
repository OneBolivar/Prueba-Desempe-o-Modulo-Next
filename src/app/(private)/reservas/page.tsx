"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Booking } from "@/types/booking";
import { BookingCard } from "@/components/bookings/BookingCard";
import { useI18n } from "@/i18n/I18nContext";

export default function BookingsPage() {
  const { t } = useI18n();
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
      setFeedback({ type: "error", text: t.bookings.cancelError });
    } finally {
      setIsLoading(false);
    }
  }, [t.bookings.cancelError]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (id: string) => {
    if (!confirm(t.bookings.confirmCancelPrompt)) {
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
        setFeedback({ type: "error", text: data.error || t.bookings.cancelError });
        return;
      }

      setFeedback({ type: "success", text: t.bookings.cancelSuccess });
      // Actualizar estado local
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
    } catch {
      setFeedback({ type: "error", text: t.bookings.cancelError });
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
            {t.bookings.userPanel}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111827] dark:text-white tracking-tight">
            {t.bookings.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            {t.bookings.subtitle}
          </p>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-[#6D28D9] hover:bg-[#5B21B6] transition-all shadow-md shadow-purple-600/20 active:scale-95"
        >
          {t.bookings.exploreMore}
        </Link>
      </div>

      {/* Alerta de feedback */}
      {feedback && (
        <div
          className={`p-4 text-xs sm:text-sm rounded-2xl border flex items-center justify-between transition-all ${
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
            {t.bookings.closeAlert}
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
          {t.bookings.filterAll} ({bookings.length})
        </button>
        <button
          onClick={() => setStatusFilter("CONFIRMED")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            statusFilter === "CONFIRMED"
              ? "bg-[#6D28D9] text-white shadow-xs"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          {t.bookings.filterConfirmed} ({bookings.filter((b) => b.status === "CONFIRMED").length})
        </button>
        <button
          onClick={() => setStatusFilter("CANCELLED")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            statusFilter === "CANCELLED"
              ? "bg-[#6D28D9] text-white shadow-xs"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          {t.bookings.filterCancelled} ({bookings.filter((b) => b.status === "CANCELLED").length})
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
            {t.bookings.emptyState}
          </p>
          <Link
            href="/"
            className="mt-3 inline-block px-4 py-2 text-xs font-bold text-[#6D28D9] dark:text-[#A78BFA] hover:underline"
          >
            {t.bookings.bookNewSpace} &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              cancellingId={cancellingId}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
}
