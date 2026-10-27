import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

interface DecodedTokenPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
  exp: number;
}

function decodeJwtPayload(token: string): DecodedTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const parsed = JSON.parse(jsonPayload) as DecodedTokenPayload;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    if (parsed.exp && parsed.exp < currentTimeInSeconds) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 1. Control de Rate Limiting por IP (100 peticiones por minuto)
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const { isAllowed } = checkRateLimit(clientIp, 100, 60 * 1000);
  if (!isAllowed) {
    return new NextResponse(
      JSON.stringify({ error: "Demasiadas peticiones. Intenta de nuevo en un momento." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const userPayload = accessToken ? decodeJwtPayload(accessToken) : null;
  const hasValidSession = Boolean(userPayload || refreshToken);

  // 2. Si retrocede a login o registro estando autenticado, enviarlo directo al Dashboard
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  if (isAuthRoute && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Rutas exclusivas para el Administrador
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    if (!hasValidSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userPayload?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 4. Rutas protegidas estándar
  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/reservas") ||
    pathname.startsWith("/perfil");

  if (isPrivateRoute && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Configurar cabeceras de no almacenamiento en caché para evitar vistas estáticas al retroceder
  const response = NextResponse.next();
  if (isPrivateRoute || isAdminRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/dashboard/:path*",
    "/reservas/:path*",
    "/perfil/:path*",
  ],
};  