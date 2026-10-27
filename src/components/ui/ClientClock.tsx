"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nContext";

export function ClientClock() {
  const { locale } = useI18n();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [timeZone, setTimeZone] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);

    const updateClock = () => {
      const now = new Date();
      const intlLocale = locale === "es" ? "es-CO" : "en-US";

      // Formateo de hora con segundos
      const formattedTime = new Intl.DateTimeFormat(intlLocale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);

      // Formateo de fecha y día de la semana
      const formattedDate = new Intl.DateTimeFormat(intlLocale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(now);

      // Zona horaria local del cliente
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

      setTimeStr(formattedTime);
      setDateStr(formattedDate);
      setTimeZone(tz);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  // Placeholder estático durante SSR / hidratación inicial para prevenir Hydration Mismatch (Punto 10)
  if (!isMounted) {
    return (
      <div
        suppressHydrationWarning
        className="w-full sm:w-auto min-w-[280px] rounded-2xl border border-purple-200/70 dark:border-purple-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 shadow-xs animate-pulse"
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {locale === "es" ? "Sincronizando..." : "Synchronizing..."}
            </span>
          </div>
          <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2" />
        <div className="h-3.5 w-44 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
    );
  }

  return (
    <div
      suppressHydrationWarning
      className="w-full sm:w-auto min-w-[280px] rounded-2xl border border-purple-200/80 dark:border-purple-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all group"
    >
      {/* Encabezado con estado en vivo y badge */}
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="inline-flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
            {locale === "es" ? "Telemetría en Vivo" : "Live Telemetry"}
          </span>
        </div>

        {/* Icono de Reloj estilizado */}
        <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-[#6D28D9] dark:text-[#A78BFA] group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Hora con segundos en formato tabular */}
      <div className="font-mono font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight tabular-nums">
        {timeStr}
      </div>

      {/* Fecha local y zona horaria */}
      <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-purple-100/60 dark:border-purple-900/40 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <span className="capitalize">{dateStr}</span>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">
          {timeZone}
        </span>
      </div>
    </div>
  );
}
