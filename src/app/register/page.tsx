"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { validatePassword } from "@/lib/validators";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      setErrorMessage(passwordCheck.error || "Contraseña inválida.");
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "No se pudo registrar el usuario.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#6D28D9] items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-purple-500/25 mb-3">
            C
          </div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">
            Crear una cuenta
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Únete y reserva espacios de trabajo al instante
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent transition-all bg-gray-50/50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent transition-all bg-gray-50/50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres y un número o símbolo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent transition-all bg-gray-50/50 hover:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 mt-2 rounded-xl text-white font-bold text-sm bg-[#6D28D9] hover:bg-[#5b21b6] active:scale-[0.99] transition-all shadow-md shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link className="font-bold text-[#EC4899] hover:text-[#db2777] transition-colors" href="/login">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}