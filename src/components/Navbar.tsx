"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logotipo / Marca */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-violet-700 transition-colors">
            C
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-violet-600 transition-colors">
            Co<span className="text-violet-600">Space</span>
          </span>
        </Link>

        {/* Enlaces de Navegación y Sesión */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
          >
            Explorar Espacios
          </Link>

          {isLoading ? (
            <div className="w-20 h-8 bg-gray-100 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Enlace a reservas personales */}
              <Link
                href="/reservas"
                className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors hidden sm:inline-block"
              >
                Mis Reservas
              </Link>

              {/* Enlace exclusivo para Administradores */}
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
                >
                  Panel Admin
                </Link>
              )}

              {/* Información del usuario */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
                
                {/* Botón Logout */}
                <button
                  onClick={() => logout()}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-sm transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}