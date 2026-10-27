"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nContext";

export function ClientClock() {
  const { locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [clientTime, setClientTime] = useState<string>("");

  useEffect(() => {
    // Control de hidratación estricto: solo se activa en cliente tras montaje
    setMounted(true);

    const updateClock = () => {
      const now = new Date();
      const intlLocale = locale === "es" ? "es-CO" : "en-US";

      const formatted = new Intl.DateTimeFormat(intlLocale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now);

      setClientTime(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  // Durante SSR inicial o mientras !mounted, renderizamos un skeleton visual
  // que evita mismatch de hidratación entre servidor y navegador cliente
  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-slate-600" />
        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">
          {locale === "es" ? "Sincronizando reloj..." : "Syncing clock..."}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-xs font-bold text-[#6D28D9] dark:text-[#A78BFA] shadow-xs transition-all">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="capitalize">{clientTime}</span>
    </div>
  );
}

