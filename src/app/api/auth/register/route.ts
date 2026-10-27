import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/validators";
import { Role } from "@prisma/client";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validar presencia de campos obligatorios
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "El nombre es obligatorio y debe tener al menos 2 caracteres." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json(
        { error: "Debes ingresar un correo electrónico válido." },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password || "");
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Consulta con Prisma ORM: Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo electrónico ya se encuentra registrado." },
        { status: 409 }
      );
    }

    // 3. Cifrado seguro de la contraseña
    const hashedPassword = await hashPassword(password);

    // 4. Inserción con Prisma ORM: Forzar rol USER
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/auth/register:", error);
    return NextResponse.json(
      { error: "Ocurrió un error interno al registrar el usuario." },
      { status: 500 }
    );
  }
}