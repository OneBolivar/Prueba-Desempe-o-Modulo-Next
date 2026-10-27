import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifyRefreshToken,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  hashPassword,
  setAuthCookies,
} from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const currentRefreshToken = cookieStore.get("refresh_token")?.value;

    if (!currentRefreshToken) {
      return NextResponse.json(
        { error: "No se encontró el token de actualización." },
        { status: 401 }
      );
    }

    // 1. Verificar firma y expiración del token
    const payload = verifyRefreshToken(currentRefreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Token de actualización inválido o expirado." },
        { status: 401 }
      );
    }

    // 2. Consultar al usuario en la base de datos con Prisma
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshToken) {
      return NextResponse.json(
        { error: "Sesión no válida o revocada." },
        { status: 401 }
      );
    }

    // 3. Comparar el token recibido con el hash persistido
    const isTokenMatching = await comparePassword(
      currentRefreshToken,
      user.refreshToken
    );

    if (!isTokenMatching) {
      return NextResponse.json(
        { error: "Token de actualización no reconocido." },
        { status: 401 }
      );
    }

    // 4. Generar nuevo par de tokens (rotación)
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = signAccessToken(tokenPayload);
    const newRefreshToken = signRefreshToken(tokenPayload);

    // 5. Actualizar el nuevo hash en la base de datos
    const newHashedRefreshToken = await hashPassword(newRefreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newHashedRefreshToken },
    });

    // 6. Actualizar las cookies httpOnly
    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json(
      { message: "Sesión renovada con éxito." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/auth/refresh:", error);
    return NextResponse.json(
      { error: "Error interno al renovar la sesión." },
      { status: 500 }
    );
  }
}