"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Space, SpaceFilters } from "@/types/space";
import { SpaceCard } from "@/components/SpaceCard";

export default function HomePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<SpaceFilters>({
    type: "",
    minCapacity: "",
    maxPrice: "",
  });

  const fetchSpaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.set("type", filters.type);
      if (filters.minCapacity) queryParams.set("minCapacity", filters.minCapacity);
      if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);

      const res = await fetch(`/api/spaces?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSpaces(data.spaces || []);
      } else {
        setSpaces([]);
      }
    } catch (error) {
      console.error("Error al cargar espacios:", error);
      setSpaces([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ type: "", minCapacity: "", maxPrice: "" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">
      {/* Banner Encabezado */}
      <section className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] text-xs font-bold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
          Disponibilidad en tiempo real
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#111827] dark:text-white tracking-tight">
          Espacios diseñados para tu enfoque
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-slate-400 max-w-2xl font-medium">
          Reserva escritorios compartidos, oficinas privadas y cabinas insonorizadas por hora sin contratos permanentes.
        </p>
      </section>

      {/* Contenedor de Filtros Dinámicos */}
      <div className="bg-white dark:bg-[#1E293B] p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs mb-10 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro: Tipo de Espacio */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 mb-1.5">
              Tipo de espacio
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] bg-gray-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-750 transition-all"
            >
              <option value="">Todos los tipos</option>
              <option value="Escritorio">Escritorio</option>
              <option value="Sala de reuniones">Sala de reuniones</option>
              <option value="Cabina">Cabina</option>
            </select>
          </div>

          {/* Filtro: Capacidad Mínima */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 mb-1.5">
              Capacidad mínima (pers.)
            </label>
            <input
              type="number"
              name="minCapacity"
              min="1"
              placeholder="Ej. 1"
              value={filters.minCapacity}
              onChange={handleFilterChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] bg-gray-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-750 transition-all"
            />
          </div>

          {/* Filtro: Precio Máximo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 mb-1.5">
              Precio máx. hora (COP)
            </label>
            <input
              type="number"
              name="maxPrice"
              min="1000"
              step="5000"
              placeholder="Ej. 50000"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] bg-gray-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-750 transition-all"
            />
          </div>

          {/* Botón Reset */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              type="button"
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-98"
            >
              Restablecer
            </button>
          </div>
        </div>
      </div>

      {/* Grid Dinámico de Espacios */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-100 dark:border-slate-800 h-88 animate-pulse p-5 flex flex-col justify-between"
            >
              <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
              <div className="space-y-2 mt-4">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-md w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-md w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
          <p className="text-base font-bold text-gray-700 dark:text-slate-300">
            No se encontraron espacios con los filtros indicados.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-3 px-4 py-2 text-xs font-bold text-[#6D28D9] dark:text-[#A78BFA] hover:underline"
          >
            Limpiar filtros y ver todos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}
