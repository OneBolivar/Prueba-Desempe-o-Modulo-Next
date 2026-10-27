"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, AuthContextType } from "@/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Sincronizar estado cuando la pestaña vuelve a enfocarse
    const onFocus = () => checkAuth();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [checkAuth]);

  const login = async (email: string, password: string, redirectTo?: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Error al iniciar sesión." };
      }

      setUser(data.user);
      const destination = redirectTo || "/dashboard";
      router.refresh();
      router.push(destination);
      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión con el servidor." };
    }
  };

  const register = async (name: string, email: string, password: string, redirectTo?: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Error al registrarse." };
      }

      // Iniciar sesión automáticamente tras el registro respetando la ruta destino
      return await login(email, password, redirectTo);
    } catch {
      return { success: false, error: "Error de conexión con el servidor." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}