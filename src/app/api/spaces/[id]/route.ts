import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { Role } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/spaces/[id] - Obtener detalle de un espacio específico
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const space = await prisma.space.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: "CONFIRMED",
            endTime: { gte: new Date() },
          },
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (!space) {
      return NextResponse.json(
        { error: "El espacio solicitado no existe." },
        { status: 404 }
      );
    }

    return NextResponse.json({ space }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/spaces/[id]:", error);
    return NextResponse.json(
      { error: "Error interno al consultar el espacio." },
      { status: 500 }
    );
  }
}

// PATCH /api/spaces/[id] - Actualizar o alternar estado activo/inactivo (Exclusivo Administrador)
export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de Administrador." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const existingSpace = await prisma.space.findUnique({
      where: { id },
    });

    if (!existingSpace) {
      return NextResponse.json(
        { error: "El espacio a actualizar no existe." },
        { status: 404 }
      );
    }

    const updatedSpace = await prisma.space.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.description && { description: body.description.trim() }),
        ...(body.type && { type: body.type.trim() }),
        ...(body.capacity !== undefined && { capacity: Number(body.capacity) }),
        ...(body.pricePerHour !== undefined && { pricePerHour: Number(body.pricePerHour) }),
        ...(body.imageUrl && { imageUrl: body.imageUrl.trim() }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    return NextResponse.json(
      {
        message: "Espacio actualizado exitosamente.",
        space: updatedSpace,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/spaces/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar el espacio." },
      { status: 500 }
    );
  }
}