import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Funkcja do wyciągania subdomeny i dopasowania jej do języka
function getLocaleFromSubdomain(hostname: string, defaultLocale: string) {
  const subdomain = hostname.split(".")[0];

  return routing.locales.includes(subdomain) ? subdomain : defaultLocale;
}

export function middleware(request: Request) {
  const hostname =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  // Zidentyfikuj język na podstawie subdomeny
  const locale = getLocaleFromSubdomain(hostname, routing.defaultLocale);
  // Ustawienie nagłówka `locale` w odpowiedzi
  const response = NextResponse.next();
  response.cookies.set("locale", locale);

  return response;
}

export const config = {
  matcher: "/(.*)",
};
