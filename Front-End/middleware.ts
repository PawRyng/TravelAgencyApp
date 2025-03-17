import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Funkcja do wyciągania subdomeny i dopasowania jej do języka
function getLocaleFromSubdomain(hostname: string, defaultLocale: string) {
  const subdomain = hostname.split(".")[0];

  return routing.locales.includes(subdomain) ? subdomain : defaultLocale;
}

export function middleware(request: NextRequest) {
  const hostname =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  // Zidentyfikuj język na podstawie subdomeny
  const locale = getLocaleFromSubdomain(hostname, routing.defaultLocale);
  // Ustawienie nagłówka `locale` w odpowiedzi
  let response = NextResponse.next();
  response.cookies.set("locale", locale);

  // const cookies = cookies();
  const token = request.cookies.get("auth_token");

  const currentPath = request.nextUrl.pathname;

  if (currentPath === "/login") {
    if (token) {
      response = NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
  } else if (currentPath === "/dashboard") {
    if (!token) {
      response = NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
  return response;
}

export const config = {
  matcher: "/(.*)",
};
