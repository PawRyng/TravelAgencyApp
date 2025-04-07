import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getLogged, getIsAdmin } from "./controller/sessionHandle";

// Funkcja do wyciągania subdomeny i dopasowania jej do języka
function getLocaleFromSubdomain(hostname: string, defaultLocale: string) {
  const subdomain = hostname.split(".")[0];

  return routing.locales.includes(subdomain) ? subdomain : defaultLocale;
}

export async function middleware(request: NextRequest) {
  const hostname =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  // Zidentyfikuj język na podstawie subdomeny
  const locale = getLocaleFromSubdomain(hostname, routing.defaultLocale);
  // Ustawienie nagłówka `locale` w odpowiedzi
  let response = NextResponse.next();
  response.cookies.set("locale", locale);

  const isLogged = await getLogged();
  const currentPath = request.nextUrl.pathname;

  // Zabezpieczenie dla /login
  if (currentPath === "/login" && isLogged) {
    response = NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // Zabezpieczenie dla /dashboard
  else if (currentPath === "/dashboard" && !isLogged) {
    response = NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Zabezpieczenie dla /users i /users/add/[id]
  else if (currentPath.startsWith("/users")) {
    if (!isLogged) {
      response = NextResponse.redirect(new URL("/login", request.nextUrl));
    } else {
      const isAdmin = await getIsAdmin();
      if (!isAdmin) {
        response = NextResponse.redirect(
          new URL("/dashboard", request.nextUrl)
        );
      }
    }
  } else if (currentPath.startsWith("/travels")) {
    if (!isLogged) {
      response = NextResponse.redirect(new URL("/login", request.nextUrl));
    } else {
      if (currentPath === "/travels/add") {
        const isAdmin = await getIsAdmin();
        if (!isAdmin) {
          response = NextResponse.redirect(
            new URL("/dashboard", request.nextUrl)
          );
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: "/(.*)",
};
