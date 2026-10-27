"use client";

import React from "react";
import { useI18n } from "@/i18n/I18nContext";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "es" ? "en" : "es")}
      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#111827] dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
      aria-label="Cambiar idioma"
      title="Cambiar idioma (ES/EN)"
    >
      {locale === "es" ? "🇺🇸 EN" : "🇪🇸 ES"}
    </button>
  );
}