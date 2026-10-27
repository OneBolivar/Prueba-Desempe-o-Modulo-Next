"use client";

import React from "react";
import Link from "next/link";
import { Space } from "@/types/space";

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(space.pricePerHour);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Imagen del Espacio */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={space.imageUrl}
          alt={space.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-violet-700 shadow-sm">
          {space.type}
        </span>
      </div>

      {/* Información del Espacio */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
              {space.name}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium shrink-0">
              {space.capacity} {space.capacity === 1 ? "persona" : "personas"}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {space.description}
          </p>
        </div>

        {/* Tarifa y Enlace a Detalle/Reserva */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">Tarifa por hora</span>
            <span className="text-lg font-extrabold text-violet-600">
              {formattedPrice}
            </span>
          </div>

          <Link
            href={`/espacios/${space.id}`}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-sm"
          >
            Reservar
          </Link>
        </div>
      </div>
    </div>
  );
}