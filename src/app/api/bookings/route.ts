import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { validateBookingDates } from "@/lib/validators";
import { Role } from "@prisma/client";

// GET /api/bookings - Listar reservas (propias para USER, todas para ADMIN)
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión para continuar." },
        { status: 401 }
      );
    }

    const isAdmin = session.role === Role.ADMIN;

    const bookings = await prisma.booking.findMany({
      where: isAdmin ? {} : { userId: session.userId },
      include: {
        space: {
          select: {
            id: true,
            name: true,
            type: true,
            imageUrl: true,
            pricePerHour: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/bookings:", error);
    return NextResponse.json(
      { error: "Error al consultar las reservas." },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Crear una nueva reserva con blindaje estricto de reglas de negocio
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para realizar una reserva." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { spaceId, startTime, endTime } = body;

    if (!spaceId || typeof spaceId !== "string") {
      return NextResponse.json(
        { error: "Debes especificar el espacio a reservar." },
        { status: 400 }
      );
    }

    // 1. Validar reglas de fechas y horarios (horas en punto :00, 1-4h duración, 07:00 a 21:00, max 30 días)
    const dateValidation = validateBookingDates(startTime, endTime);
    if (
      !dateValidation.isValid ||
      !dateValidation.startTime ||
      !dateValidation.endTime ||
      !dateValidation.totalHours
    ) {
      return NextResponse.json(
        { error: dateValidation.error || "Rango de fechas y horas no válido." },
        { status: 400 }
      );
    }

    const { startTime: start, endTime: end, totalHours } = dateValidation;
    const now = new Date();

    // 2. Verificar existencia y estado del espacio
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      return NextResponse.json(
        { error: "El espacio seleccionado no existe." },
        { status: 404 }
      );
    }

    // Regla: Rechazar si el espacio tiene isActive = false (HTTP 400)
    if (!space.isActive) {
      return NextResponse.json(
        { error: "Este espacio se encuentra inactivo y no admite reservas." },
        { status: 400 }
      );
    }

    // 3. Regla: Límite de reservas activas futuras (máximo 3 por usuario) -> HTTP 409
    const activeFutureBookingsCount = await prisma.booking.count({
      where: {
        userId: session.userId,
        status: "CONFIRMED",
        endTime: { gte: now },
      },
    });

    if (activeFutureBookingsCount >= 3) {
      return NextResponse.json(
        {
          error:
            "Has alcanzado el límite máximo de 3 reservas activas simultáneas. Cancela o completa una antes de reservar de nuevo.",
        },
        { status: 409 }
      );
    }

    // 4. Regla: Solapamiento por usuario autenticado (no puede tener 2 reservas al mismo tiempo) -> HTTP 409
    const userOverlap = await prisma.booking.findFirst({
      where: {
        userId: session.userId,
        status: "CONFIRMED",
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (userOverlap) {
      return NextResponse.json(
        {
          error:
            "Ya cuentas con otra reserva confirmada en este mismo rango horario en otro espacio.",
        },
        { status: 409 }
      );
    }

    // 5. Regla: Solapamiento por espacio (Double Booking check) -> HTTP 409
    const spaceOverlap = await prisma.booking.findFirst({
      where: {
        spaceId: space.id,
        status: "CONFIRMED",
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (spaceOverlap) {
      return NextResponse.json(
        {
          error:
            "El espacio ya está reservado en el horario seleccionado. Si una reserva termina a las 12:00, otra puede iniciar a las 12:00.",
        },
        { status: 409 }
      );
    }

    // 6. Cálculo seguro de precio en el servidor (horas * pricePerHour). Se ignora cualquier valor cliente.
    const totalPrice = space.pricePerHour * totalHours;

    // 7. Crear la reserva confirmada
    const newBooking = await prisma.booking.create({
      data: {
        userId: session.userId,
        spaceId: space.id,
        startTime: start,
        endTime: end,
        totalHours,
        totalPrice,
        status: "CONFIRMED",
      },
      include: {
        space: {
          select: {
            name: true,
            type: true,
            pricePerHour: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Reserva realizada exitosamente.",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/bookings:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la reserva." },
      { status: 500 }
    );
  }
}
