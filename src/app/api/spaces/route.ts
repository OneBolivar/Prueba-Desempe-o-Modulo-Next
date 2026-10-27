import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { validateSpaceData } from "@/lib/validators";
import { Prisma, Role } from "@prisma/client";

// GET /api/spaces - Listar y filtrar espacios de coworking
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const minCapacity = searchParams.get("minCapacity");
    const maxPrice = searchParams.get("maxPrice");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const session = await getServerSession();
    const isAdmin = session?.role === Role.ADMIN;

    // Filtros dinámicos con Prisma
    const whereClause: Prisma.SpaceWhereInput = {};

    // Si no es admin o no solicita inactivos, solo mostrar espacios activos
    if (!isAdmin || !includeInactive) {
      whereClause.isActive = true;
    }

    if (type && type.trim() !== "") {
      whereClause.type = {
        equals: type.trim(),
        mode: "insensitive",
      };
    }

    if (minCapacity && !isNaN(Number(minCapacity))) {
      whereClause.capacity = {
        gte: parseInt(minCapacity, 10),
      };
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      whereClause.pricePerHour = {
        lte: parseFloat(maxPrice),
      };
    }

    const spaces = await prisma.space.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ spaces }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/spaces:", error);
    return NextResponse.json(
      { error: "Error al obtener el catálogo de espacios." },
      { status: 500 }
    );
  }
}

// POST /api/spaces - Crear nuevo espacio (Exclusivo Administrador)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de Administrador." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = validateSpaceData(body);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const newSpace = await prisma.space.create({
      data: {
        name: body.name.trim(),
        description: body.description.trim(),
        type: body.type.trim(),
        capacity: Number(body.capacity),
        pricePerHour: Number(body.pricePerHour),
        imageUrl: body.imageUrl.trim(),
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        message: "Espacio creado exitosamente.",
        space: newSpace,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/spaces:", error);
    return NextResponse.json(
      { error: "Error interno al crear el espacio." },
      { status: 500 }
    );
  }
}