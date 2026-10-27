import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, verifyRefreshToken, clearAuthCookies } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    // Obtener el identificador del usuario desde cualquiera de los tokens disponibles
    const payload =
      (accessToken ? verifyAccessToken(accessToken) : null) ||
      (refreshToken ? verifyRefreshToken(refreshToken) : null);

    if (payload?.userId) {
      // Revocar el refresh token en la base de datos anulando su valor
      await prisma.user.update({
        where: { id: payload.userId },
        data: { refreshToken: null },
      });
    }

    // Destruir las cookies en el cliente
    await clearAuthCookies();

    return NextResponse.json(
      { message: "Sesión cerrada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/auth/logout:", error);
    // Asegurar limpieza de cookies incluso ante un fallo inesperado
    await clearAuthCookies();
    return NextResponse.json(
      { error: "Error al cerrar la sesión en el servidor." },
      { status: 500 }
    );
  }
}