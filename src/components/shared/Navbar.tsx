"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useI18n } from "@/i18n/I18nContext";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-xs transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logotipo / Marca estilo Vibrant Workspace */}
        <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#6D28D9] flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-purple-600/20 group-hover:bg-[#5B21B6] transition-all">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-[#111827] dark:text-white">
              Co<span className="text-[#6D28D9] dark:text-[#8B5CF6]">Space</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider -mt-1">
              {t.nav.hubSubtitle}
            </span>
          </div>
        </Link>

        {/* Enlaces de Navegación de Escritorio */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-bold text-gray-600 dark:text-slate-300 hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] transition-colors"
          >
            {t.nav.explore}
          </Link>

          {isLoading ? (
            <div className="w-20 h-8 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm font-bold text-gray-600 dark:text-slate-300 hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] transition-colors"
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/reservas"
                className="text-xs sm:text-sm font-bold text-gray-600 dark:text-slate-300 hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] transition-colors"
              >
                {t.nav.myBookings}
              </Link>

              {user.role === "ADMIN" && (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] hover:bg-[#8B5CF6]/25 transition-all"
                  >
                    {t.nav.adminPanel}
                  </Link>
                  <Link
                    href="/admin/spaces"
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#EC4899]/15 text-[#EC4899] dark:text-[#F472B6] hover:bg-[#EC4899]/25 transition-all"
                  >
                    {t.nav.spacesAdmin}
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-slate-700">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#111827] dark:text-slate-200 leading-tight">
                    {user.name}
                  </p>
                  <span className="inline-block px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={() => logout()}
                  className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 transition-colors cursor-pointer"
                >
                  {t.nav.logout}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-slate-200 hover:text-[#6D28D9] dark:hover:text-[#8B5CF6] rounded-xl transition-colors"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl shadow-md shadow-purple-600/20 active:scale-95 transition-all"
              >
                {t.nav.register}
              </Link>
            </div>
          )}

          {/* Selectores: Idioma y Tema */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-slate-700">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </nav>

        {/* Acciones Móviles (Language, Theme y Botón Hamburguesa) */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Abrir menú de navegación"
            className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú Colapsable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] px-4 py-4 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="block px-3 py-2 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl"
          >
            {t.nav.explore}
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/reservas"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.nav.myBookings}
              </Link>

              {user.role === "ADMIN" && (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-sm font-bold text-[#6D28D9] dark:text-[#A78BFA] hover:bg-purple-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    {t.nav.adminPanel}
                  </Link>
                  <Link
                    href="/admin/spaces"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-sm font-bold text-[#EC4899] dark:text-[#F472B6] hover:bg-pink-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    {t.nav.spacesAdmin}
                  </Link>
                </>
              )}

              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between px-3">
                <div>
                  <p className="text-xs font-bold text-[#111827] dark:text-slate-100">{user.name}</p>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">{user.role}</span>
                </div>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 cursor-pointer"
                >
                  {t.nav.logout}
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="text-center py-2 text-xs font-bold text-gray-700 dark:text-slate-200 bg-gray-50 dark:bg-slate-800 rounded-xl"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="text-center py-2 text-xs font-bold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl shadow-md shadow-purple-600/20"
              >
                {t.nav.register}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

