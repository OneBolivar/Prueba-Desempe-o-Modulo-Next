import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 text-center bg-slate-50/50 dark:bg-[#0F172A]/50 transition-colors">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Badge de Alerta Superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-[#EC4899] text-xs font-black uppercase tracking-wider mb-8 animate-pulse">
          <span>¡Oops! Cable desconectado • Error 404</span>
        </div>

        {/* Ilustración / Tarjeta Gráfica */}
        <div className="w-64 sm:w-72 h-44 sm:h-48 rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center p-6 mb-8 relative overflow-hidden group">
          <div className="w-20 h-20 rounded-2xl bg-[#6D28D9]/10 dark:bg-[#8B5CF6]/20 flex items-center justify-center text-4xl mb-2 group-hover:scale-110 transition-transform">
            🐼
          </div>
          <div className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-slate-700 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-slate-300">
            PAGE NOT FOUND
          </div>
        </div>

        {/* Encabezado y Descripción */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] dark:text-white tracking-tight mb-4">
          Parece que este espacio <span className="text-[#6D28D9] dark:text-[#8B5CF6]">no existe</span> o se ha movido
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 max-w-lg mb-8 leading-relaxed">
          Nuestro guardián tropezó con los cables del servidor mientras buscaba un lugar tranquilo para trabajar. No te preocupes, tus reservas y puestos están a salvo.
        </p>

        {/* Botones de Acción Principales */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-sm shadow-md shadow-purple-600/20 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Explorar
          </Link>
          <Link
            href="/reservas"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-[#111827] dark:text-slate-200 font-bold text-sm shadow-xs active:scale-95 transition-all"
          >
            <svg className="w-4 h-4 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ver Mis Reservas
          </Link>
        </div>

        {/* Atajos Rápidos */}
        <div className="w-full pt-8 border-t border-gray-200 dark:border-slate-800">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-6">
            Atajos útiles para continuar trabajando
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link
              href="/"
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 hover:border-[#8B5CF6]/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-[#6D28D9] dark:text-[#A78BFA] text-lg">
                  🏢
                </span>
                <span className="text-gray-400 group-hover:text-[#6D28D9] dark:group-hover:text-[#8B5CF6] transition-colors">
                  →
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#111827] dark:text-white">Cabinas & Escritorios</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Descubre puestos flexibles, hot desks y salas de reuniones disponibles.
              </p>
            </Link>

            <Link
              href="/dashboard"
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 hover:border-[#8B5CF6]/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-[#EC4899] text-lg">
                  📊
                </span>
                <span className="text-gray-400 group-hover:text-[#EC4899] transition-colors">
                  →
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#111827] dark:text-white">Panel de Usuario</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Consulta tus estadísticas, reservas activas y balance acumulado.
              </p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}