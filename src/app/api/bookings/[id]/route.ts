import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { Role } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/bookings/[id]/cancel - Cancelar reserva
export async function PATCH(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "La reserva no existe." },
        { status: 404 }
      );
    }

    // Regla: Solo el dueño de la reserva o un ADMIN pueden cancelarla
    const isOwner = booking.userId === session.userId;
    const isAdmin = session.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "No tienes permiso para cancelar esta reserva." },
        { status: 403 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "La reserva ya se encuentra cancelada." },
        { status: 400 }
      );
    }

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
    console.error("Error en PATCH /api/bookings/[id]/cancel:", error);
    return NextResponse.json(
      { error: "Error al cancelar la reserva." },
      { status: 500 }
    );
  }
}