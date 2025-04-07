"use server";
import { decode } from "jsonwebtoken";
import type { DecodeTokenType } from "@/types/token";
import { cookies } from "next/headers";
class SessionHandler {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }
  private decodeToken(): DecodeTokenType {
    const decoded = decode(this.token);

    if (decoded === null) {
      throw new Error("Invalid token");
    }

    return decoded as DecodeTokenType;
  }

  public isLogged() {
    const { email, id } = this.decodeToken();
    return email && id ? true : false;
  }

  public isAdmin() {
    if (!this.isLogged()) {
      return false;
    }

    const { isAdmin } = this.decodeToken();

    return isAdmin ? true : false;
  }
}

export async function getLogged() {
  const cookie = await cookies();
  const token: string | undefined = cookie.get("auth_token")?.value;

  if (token) {
    const session = new SessionHandler(token);
    return session.isLogged();
  } else {
    return false;
  }
}

export async function getIsAdmin() {
  const cookie = await cookies();
  const token: string | undefined = cookie.get("auth_token")?.value;

  if (token) {
    const session = new SessionHandler(token);
    return session.isAdmin();
  } else {
    return false;
  }
}
