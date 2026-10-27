import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import { validateEmail } from "@/lib/validators";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validar entradas básicas
    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json(
        { error: "Debes proporcionar un correo electrónico válido." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Debes proporcionar tu contraseña." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Consulta con Prisma ORM: Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales de acceso inválidas." },
        { status: 401 }
      );
    }

    // 3. Comparar contraseñas cifradas
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales de acceso inválidas." },
        { status: 401 }
      );
    }

    // 4. Generar par de tokens con el payload tipado
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // 5. Hashear y persistir el Refresh Token en la base de datos para revocación
    const hashedRefreshToken = await hashPassword(refreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    // 6. Inyectar cookies seguras httpOnly
    await setAuthCookies(accessToken, refreshToken);

    // 7. Retornar únicamente los datos no sensibles del usuario
    return NextResponse.json(
      {
        message: "Inicio de sesión exitoso.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/auth/login:", error);
    return NextResponse.json(
      { error: "Ocurrió un error interno al iniciar sesión." },
      { status: 500 }
    );
  }
}