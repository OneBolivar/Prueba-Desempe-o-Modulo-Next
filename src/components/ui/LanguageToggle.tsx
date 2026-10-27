"use client";

import React, { useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/I18nContext";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  // Prevención de desincronización de hidratación usando useSyncExternalStore
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isMounted) {
    return <div className="w-12 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />;
  }

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "es" ? "en" : "es")}
      className="h-9 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 dark:text-slate-200 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer shadow-2xs"
      aria-label={locale === "es" ? "Cambiar idioma a Inglés" : "Switch language to Spanish"}
      title="Cambiar idioma (ES / EN)"
    >
      <span className="text-[11px] font-black tracking-wider text-[#6D28D9] dark:text-[#A78BFA]">
        {locale === "es" ? "EN" : "ES"}
      </span>
      <span className="text-xs">{locale === "es" ? "🇺🇸" : "🇪🇸"}</span>
    </button>
  );
}

