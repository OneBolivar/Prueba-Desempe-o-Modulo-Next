import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { Role } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/bookings/[id] - Cancelación lógica de reserva
export async function PATCH(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión para continuar." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "La reserva solicitada no existe." },
        { status: 404 }
      );
    }

    // Regla: Propiedad y permisos (solo creador o ADMIN) -> HTTP 403
    const isOwner = booking.userId === session.userId;
    const isAdmin = session.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Acceso denegado. No tienes permisos para cancelar esta reserva." },
        { status: 403 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "La reserva ya se encuentra cancelada." },
        { status: 400 }
      );
    }

    // Regla: Ventana de 2 horas para usuarios con rol USER
    // Si faltan menos de 2 horas para el startTime, rechazar con HTTP 409
    if (!isAdmin) {
      const now = new Date();
      const diffMs = booking.startTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 2) {
        return NextResponse.json(
          {
            error:
              "Las reservas solo pueden ser canceladas por usuarios con al menos 2 horas de anticipación a la hora de inicio.",
          },
          { status: 409 }
        );
      }
    }

    // Regla: Borrado lógico mediante actualización de status a CANCELLED (sin borrado físico)
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(
      {
        message: "Reserva cancelada correctamente.",
        booking: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en PATCH /api/bookings/[id]:", error);
    return NextResponse.json(
      { error: "Error interno al cancelar la reserva." },
      { status: 500 }
    );
  }
}
