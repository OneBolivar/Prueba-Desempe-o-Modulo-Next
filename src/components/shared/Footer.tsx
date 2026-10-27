"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nContext";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#6D28D9] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
            C
          </div>
          <div>
            <p className="font-bold text-[#111827] dark:text-white">CoSpace Hub</p>
            <p className="text-[11px] text-gray-400 dark:text-slate-500">{t.footer.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] transition-colors">
            {t.nav.explore}
          </Link>
          <Link href="/dashboard" className="hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] transition-colors">
            {t.nav.dashboard}
          </Link>
          <Link href="/reservas" className="hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] transition-colors">
            {t.nav.myBookings}
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 dark:text-slate-500">
          &copy; 2026 CoSpace. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
