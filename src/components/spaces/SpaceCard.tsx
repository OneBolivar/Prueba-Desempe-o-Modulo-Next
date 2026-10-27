"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Space } from "@/types/space";
import { useI18n } from "@/i18n/I18nContext";

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  const { t, locale } = useI18n();

  const formattedPrice = new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(space.pricePerHour);

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Contenedor de Imagen con Tag de Tipo y optimización Next/Image */}
      <div className="relative h-52 w-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
        <Image
          src={space.imageUrl}
          alt={space.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="bg-[#111827]/80 dark:bg-black/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {space.type}
          </span>
        </div>
      </div>

      {/* Contenido e Información Dinámica */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-black text-[#111827] dark:text-white group-hover:text-[#6D28D9] dark:group-hover:text-[#8B5CF6] transition-colors line-clamp-1">
              {space.name}
            </h3>
            <span className="text-[11px] font-bold bg-[#8B5CF6]/15 text-[#6D28D9] dark:text-[#A78BFA] px-2.5 py-1 rounded-full shrink-0">
              {space.capacity} {space.capacity === 1 ? t.home.person : t.home.persons}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5">
            {space.description}
          </p>
        </div>

        {/* Precio y Botón de Acción Directo a la Reserva */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider block">
              {t.home.perHour}
            </span>
            <span className="text-base sm:text-lg font-black text-[#111827] dark:text-white">
              {formattedPrice}
            </span>
          </div>

          <Link
            href={`/spaces/${space.id}`}
            className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-sm shadow-purple-600/20 active:scale-95 transition-all"
          >
            {t.home.bookBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}

