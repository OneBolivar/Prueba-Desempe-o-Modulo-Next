"use client";

import React from "react";
import Image from "next/image";
import { Booking } from "@/types/booking";
import { useI18n } from "@/i18n/I18nContext";
import { Spinner } from "@/components/ui/Badge";

interface BookingCardProps {
  booking: Booking;
  cancellingId: string | null;
  onCancel: (id: string) => void;
}

export function BookingCard({ booking, cancellingId, onCancel }: BookingCardProps) {
  const { t, locale } = useI18n();
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const intlLocale = locale === "es" ? "es-CO" : "en-US";

  return (
    <div className="bg-white dark:bg-[#1E293B] p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Espacio y detalles de tiempo */}
      <div className="flex items-start gap-4">
        {booking.space?.imageUrl && (
          <div className="relative hidden sm:block w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
            <Image
              src={booking.space.imageUrl}
              alt={booking.space.name}
              fill
              sizes="80px"
              className="object-cover"
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
            📅 {start.toLocaleDateString(intlLocale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            ⏰ {start.toLocaleTimeString(intlLocale, { hour: "2-digit", minute: "2-digit" })} -{" "}
            {end.toLocaleTimeString(intlLocale, { hour: "2-digit", minute: "2-digit" })} ({booking.totalHours} hr{booking.totalHours > 1 ? "s" : ""})
          </p>
        </div>
      </div>

      {/* Precios, Estados y Acción */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-800">
        <div className="text-left md:text-right">
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400 block">
            {t.bookings.totalPaid}
          </span>
          <span className="text-base sm:text-lg font-black text-[#111827] dark:text-white">
            {new Intl.NumberFormat(intlLocale, {
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
          {booking.status === "CONFIRMED" ? t.bookings.statusConfirmed : t.bookings.statusCancelled}
        </span>

        {booking.status === "CONFIRMED" && (
          <button
            onClick={() => onCancel(booking.id)}
            disabled={cancellingId === booking.id}
            className="px-3.5 py-2 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 rounded-xl border border-red-200 dark:border-red-900 transition-colors disabled:opacity-50 cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            {cancellingId === booking.id ? (
              <>
                <Spinner className="w-3.5 h-3.5" />
                <span>{t.bookings.cancellingBtn}</span>
              </>
            ) : (
              t.bookings.cancelBookingBtn
            )}
          </button>
        )}
      </div>
    </div>
  );
}

