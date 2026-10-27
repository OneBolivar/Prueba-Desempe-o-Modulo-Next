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

// POST /api/bookings - Crear una nueva reserva con validación de traslape
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

    // 1. Validar reglas de fechas (no pasado, fin > inicio, mínimo 1 hora)
    const dateValidation = validateBookingDates(startTime, endTime);
    if (!dateValidation.isValid || !dateValidation.startTime || !dateValidation.endTime || !dateValidation.totalHours) {
      return NextResponse.json(
        { error: dateValidation.error || "Rango de fechas no válido." },
        { status: 400 }
      );
    }

    const { startTime: start, endTime: end, totalHours } = dateValidation;

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

    if (!space.isActive) {
      return NextResponse.json(
        { error: "Este espacio no se encuentra habilitado para nuevas reservas." },
        { status: 400 }
      );
    }

    // 3. Validar solapamiento de horarios (Double Booking check)
    // Existe conflicto si: (start < existing.endTime) Y (end > existing.startTime)
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        spaceId,
        status: "CONFIRMED",
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: "El espacio ya está reservado en el horario seleccionado. Elige otro intervalo." },
        { status: 409 }
      );
    }

    // 4. Calcular costo total dinámico en servidor
    const totalPrice = space.pricePerHour * totalHours;

    // 5. Crear la reserva
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