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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Banner Principal */}
      <section className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Encuentra tu espacio de trabajo ideal
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl">
          Reserva escritorios ergonómicos, salas de juntas y cabinas privadas por hora con disponibilidad en tiempo real.
        </p>
      </section>

      {/* Barra de Filtros Dinámicos */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          {/* Filtro: Tipo de Espacio */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tipo de espacio
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="">Todos los tipos</option>
              <option value="Escritorio">Escritorio</option>
              <option value="Sala de reuniones">Sala de reuniones</option>
              <option value="Cabina">Cabina</option>
            </select>
          </div>

          {/* Filtro: Capacidad Mínima */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Capacidad mínima (personas)
            </label>
            <input
              type="number"
              name="minCapacity"
              min="1"
              placeholder="Ej. 2"
              value={filters.minCapacity}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Filtro: Precio Máximo por Hora */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Precio máx. por hora (COP)
            </label>
            <input
              type="number"
              name="maxPrice"
              min="1000"
              step="5000"
              placeholder="Ej. 50000"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Botón para Limpiar Filtros */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              type="button"
              className="w-full py-2 px-4 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Grid del Catálogo de Espacios */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-gray-200 h-80 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="h-44 bg-gray-200 rounded-xl" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-lg font-medium text-gray-600">
            No se encontraron espacios que coincidan con los filtros seleccionados.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 text-sm font-semibold text-violet-600 hover:underline"
          >
            Ver todos los espacios
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