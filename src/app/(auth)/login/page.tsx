"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Credenciales incorrectas.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#1E293B] p-7 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">
        {/* Cabecera del formulario */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#6D28D9] items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-purple-500/25 mb-3">
            C
          </div>
          <h2 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight">
            Bienvenido de nuevo
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Ingresa a tu cuenta para gestionar tus reservas
          </p>
        </div>

        {/* Mensaje de error visual */}
        {errorMessage && (
          <div className="p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-slate-750"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-slate-750"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-[#6D28D9] hover:bg-[#5B21B6] active:scale-[0.99] transition-all shadow-md shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 dark:border-slate-800">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            ¿No tienes cuenta aún?{" "}
            <Link className="font-bold text-[#EC4899] hover:text-[#DB2777] transition-colors" href="/register">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
