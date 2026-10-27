import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SpaceDetailClient } from "@/components/spaces/SpaceDetailClient";
import { Space } from "@/types/space";

interface SpaceDetailPageProps {
  params: Promise<{ id: string }>;
}

async function SpaceDetailContent({ params }: SpaceDetailPageProps) {
  // En Next.js 16 los parámetros de ruta deben resolverse de forma asíncrona
  const { id } = await params;

  const space = await prisma.space.findUnique({
    where: { id },
  });

  if (!space) {
    notFound();
  }

  // Desacoplamos y tipamos el modelo para el cliente
  const serializedSpace: Space = {
    id: space.id,
    name: space.name,
    description: space.description,
    type: space.type,
    capacity: space.capacity,
    pricePerHour: space.pricePerHour,
    imageUrl: space.imageUrl,
    isActive: space.isActive,
    createdAt: space.createdAt.toISOString(),
    updatedAt: space.updatedAt.toISOString(),
  };

  return <SpaceDetailClient space={serializedSpace} />;
}

export default function SpaceDetailPage({ params }: SpaceDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-xl w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-96 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
            <div className="lg:col-span-5 h-96 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
          </div>
        </div>
      }
    >
      <SpaceDetailContent params={params} />
    </Suspense>
  );
}

