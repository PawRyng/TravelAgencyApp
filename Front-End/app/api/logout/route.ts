import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Tworzymy odpowiedź
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}/login`;
  const response = NextResponse.redirect(baseUrl);

  // Usuwamy ciasteczko przez ustawienie Max-Age na 0
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // Ciasteczko wygasa natychmiast
  });
  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // Ciasteczko wygasa natychmiast
  });

  return response;
}
