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

// PATCH /api/spaces/[id] - Actualizar espacio o alternar estado (Exclusivo Administrador)
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

    // Regla: Bloqueo de desactivación si tiene reservas futuras confirmadas -> HTTP 409
    if (body.isActive === false && existingSpace.isActive === true) {
      const futureConfirmedBooking = await prisma.booking.findFirst({
        where: {
          spaceId: id,
          status: "CONFIRMED",
          endTime: { gte: new Date() },
        },
      });

      if (futureConfirmedBooking) {
        return NextResponse.json(
          {
            error:
              "No es posible desactivar este espacio porque tiene reservas futuras confirmadas.",
          },
          { status: 409 }
        );
      }
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

// DELETE /api/spaces/[id] - Borrado lógico de espacio (Exclusivo Administrador)
export async function DELETE(
  _request: NextRequest,
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

    const existingSpace = await prisma.space.findUnique({
      where: { id },
    });

    if (!existingSpace) {
      return NextResponse.json(
        { error: "El espacio a desactivar no existe." },
        { status: 404 }
      );
    }

    // Regla: Bloqueo de borrado lógico si existen reservas futuras activas -> HTTP 409
    const futureConfirmedBooking = await prisma.booking.findFirst({
      where: {
        spaceId: id,
        status: "CONFIRMED",
        endTime: { gte: new Date() },
      },
    });

    if (futureConfirmedBooking) {
      return NextResponse.json(
        {
          error:
            "No es posible dar de baja este espacio porque tiene reservas futuras confirmadas.",
        },
        { status: 409 }
      );
    }

    // Borrado lógico (isActive: false) sin eliminación física
    const deactivatedSpace = await prisma.space.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(
      {
        message: "Espacio desactivado lógicamente de manera exitosa.",
        space: deactivatedSpace,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE /api/spaces/[id]:", error);
    return NextResponse.json(
      { error: "Error al desactivar el espacio." },
      { status: 500 }
    );
  }
}
