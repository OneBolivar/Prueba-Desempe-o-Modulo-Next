"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useI18n } from "@/i18n/I18nContext";

function NavbarInner() {
  const { user, logout, isLoading } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Branding e Identidad */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-purple-500/25 group-hover:scale-105 active:scale-95 transition-transform duration-200">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
              Co<span className="text-[#6D28D9] dark:text-[#A78BFA]">Space</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider -mt-1">
              {t.nav.hubSubtitle}
            </span>
          </div>
        </Link>

        {/* Enlaces de Navegación de Escritorio */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive("/") && pathname === "/"
                ? "bg-purple-100/70 dark:bg-purple-950/60 text-[#6D28D9] dark:text-[#A78BFA] font-bold shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-[#6D28D9] dark:hover:text-[#A78BFA] hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
            }`}
          >
            {t.nav.explore}
          </Link>

          {isLoading ? (
            <div className="w-24 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 lg:gap-3">
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "bg-purple-100/70 dark:bg-purple-950/60 text-[#6D28D9] dark:text-[#A78BFA] font-bold shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-[#6D28D9] dark:hover:text-[#A78BFA] hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                }`}
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/reservas"
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/reservas")
                    ? "bg-purple-100/70 dark:bg-purple-950/60 text-[#6D28D9] dark:text-[#A78BFA] font-bold shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-[#6D28D9] dark:hover:text-[#A78BFA] hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                }`}
              >
                {t.nav.myBookings}
              </Link>

              {user.role === "ADMIN" && (
                <div className="flex items-center gap-1.5 pl-1">
                  <Link
                    href="/admin"
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      isActive("/admin") && pathname === "/admin"
                        ? "bg-[#6D28D9] text-white shadow-xs"
                        : "bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] hover:bg-[#8B5CF6]/25"
                    }`}
                  >
                    {t.nav.adminPanel}
                  </Link>
                  <Link
                    href="/admin/spaces"
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      isActive("/admin/spaces")
                        ? "bg-[#EC4899] text-white shadow-xs"
                        : "bg-[#EC4899]/15 text-[#EC4899] dark:text-[#F472B6] hover:bg-[#EC4899]/25"
                    }`}
                  >
                    {t.nav.spacesAdmin}
                  </Link>
                </div>
              )}

              {/* Componente de Perfil Pulido */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-purple-500/20">
                    {getInitials(user.name)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {user.name}
                    </p>
                    <div className="mt-0.5">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60">
                          USER
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logout()}
                  title={t.nav.logout}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100/60 dark:bg-slate-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-red-200 dark:hover:border-red-900 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden xl:inline">{t.nav.logout}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#6D28D9] dark:hover:text-[#A78BFA] rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors"
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

          {/* Selector de Idioma y Tema Agrupados */}
          <div className="inline-flex items-center p-0.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 divide-x divide-slate-200 dark:divide-slate-800 ml-1">
            <div className="px-0.5">
              <LanguageToggle />
            </div>
            <div className="px-0.5">
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Acciones Móviles (Contenedor agrupado de toggles + botón hamburguesa) */}
        <div className="flex md:hidden items-center gap-2">
          <div className="inline-flex items-center p-0.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 divide-x divide-slate-200 dark:divide-slate-800">
            <div className="px-0.5">
              <LanguageToggle />
            </div>
            <div className="px-0.5">
              <ThemeToggle />
            </div>
          </div>
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Abrir menú de navegación"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer transition-colors"
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
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-4 space-y-2 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className={`block px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
              isActive("/") && pathname === "/"
                ? "bg-purple-100/70 dark:bg-purple-950/60 text-[#6D28D9] dark:text-[#A78BFA]"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
            }`}
          >
            {t.nav.explore}
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className={`block px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  isActive("/dashboard")
                    ? "bg-purple-100/70 dark:bg-purple-950/60 text-[#6D28D9] dark:text-[#A78BFA]"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                }`}
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/reservas"
                onClick={closeMobileMenu}
                className={`block px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  isActive("/reservas")
                    ? "bg-purple-100/70 dark:bg-purple-950/60 text-[#6D28D9] dark:text-[#A78BFA]"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                }`}
              >
                {t.nav.myBookings}
              </Link>

              {user.role === "ADMIN" && (
                <>
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="block px-3.5 py-2.5 text-sm font-bold text-[#6D28D9] dark:text-[#A78BFA] hover:bg-purple-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    {t.nav.adminPanel}
                  </Link>
                  <Link
                    href="/admin/spaces"
                    onClick={closeMobileMenu}
                    className="block px-3.5 py-2.5 text-sm font-bold text-[#EC4899] dark:text-[#F472B6] hover:bg-pink-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    {t.nav.spacesAdmin}
                  </Link>
                </>
              )}

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 transition-colors cursor-pointer"
                >
                  {t.nav.logout}
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="text-center py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/70 dark:bg-slate-800/70 rounded-xl"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="text-center py-2.5 text-xs font-bold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl shadow-md shadow-purple-600/20"
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

function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 h-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 animate-pulse" />
          <div className="w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarInner />
    </Suspense>
  );
}
