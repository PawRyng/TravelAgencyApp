"use server";
import { LoginFormData } from "@/types";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface ReturnData {
  status: number;
  token: string;
}
export async function login(state?: boolean, formData?: LoginFormData) {
  const cookie = await cookies();
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_BACK_END_URL}/auth/login`,
      formData
    );

    if (data.status === 200) {
      cookie.set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60,
        sameSite: "strict",
        path: "/",
      });

      cookie.set("refresh_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "strict",
        path: "/",
      });
    }
    return data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("Brak odpowiedzi z serwera:", error.request);
    } else {
      console.error("Błąd konfiguracji żądania:", error.message);
    }
  }
}
