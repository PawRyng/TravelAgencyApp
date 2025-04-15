"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function getQueryWithAuth() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("auth_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const client = axios.create({
    baseURL: process.env.NEXT_BACK_END_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Dodaj interceptor dla odpowiedzi
  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status === 403 && refreshToken) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_BACK_END_URL}/auth/token`,
            null,
            {
              headers: {
                Cookie: `refreshToken=${refreshToken}`,
              },
            }
          );

          accessToken = res.data.accessToken;

          // Zaktualizuj nagłówek i powtórz oryginalne żądanie
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return client.request(error.config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Ustaw token od razu na start
  if (accessToken) {
    client.defaults.headers.Authorization = `Bearer ${accessToken}`;
  }

  return client;
}
