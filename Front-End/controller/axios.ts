"use server";

import axios from "axios";
import { cookies } from "next/headers";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_BACK_END_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const cookie = cookies();

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = (await cookie).get("refresh_token");

      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.NEXT_BACK_END_URL}/auth/token`, {
            refreshToken: refreshToken,
          })
          .then(async ({ data }) => {
            (await cookie).set("auth_token", data.newToken);

            axiosClient.defaults.headers["Authorization"] =
              `Bearer ${data.newToken}`;
            originalRequest.headers["Authorization"] =
              `Bearer ${data.newToken}`;
            processQueue(null, data.newToken);
            resolve(axiosClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
