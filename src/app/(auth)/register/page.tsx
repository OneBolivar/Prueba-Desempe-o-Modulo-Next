"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { validatePassword } from "@/lib/validators";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user, isLoading } = useAuth();

  const rawFrom = searchParams.get("from");
  const redirectUrl = rawFrom ? decodeURIComponent(rawFrom) : "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir de inmediato si ya existe una sesión activa
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl]);

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
    const result = await register(name, email, password, redirectUrl);
    setIsSubmitting(false);

    if (result.success) {
      router.refresh();
      router.push(redirectUrl);
    } else {
      setErrorMessage(result.error || "No se pudo registrar el usuario.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md p-8 sm:p-10 bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 animate-pulse text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-200 dark:bg-purple-900/40 mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-lg w-2/3 mx-auto mb-2" />
        <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded-lg w-1/2 mx-auto" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#1E293B] p-7 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">
      <div className="text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-purple-500/25 mb-3 transition-transform hover:scale-105">
          C
        </div>
        <h2 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight">
          Crear una cuenta
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Únete y reserva espacios de trabajo al instante
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2">
          <span className="font-semibold">Error:</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Nombre Completo
          </label>
          <input
            type="text"
            required
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-slate-750"
          />
        </div>

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
            placeholder="Mínimo 6 caracteres y un número o símbolo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-slate-750"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-[#6D28D9] hover:bg-[#5B21B6] active:scale-[0.99] transition-all shadow-md shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {isSubmitting ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-gray-100 dark:border-slate-800">
        <p className="text-sm text-gray-600 dark:text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            className="font-bold text-[#EC4899] hover:text-[#DB2777] transition-colors"
            href={rawFrom ? `/login?from=${encodeURIComponent(rawFrom)}` : "/login"}
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md p-8 sm:p-10 bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 animate-pulse text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-200 dark:bg-purple-900/40 mb-4" />
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-lg w-2/3 mx-auto mb-2" />
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded-lg w-1/2 mx-auto" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
