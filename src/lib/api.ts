import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data;
    const message =
      (typeof data === "string" ? data : undefined) ||
      data?.erro ||
      data?.message ||
      data?.error ||
      error.message ||
      "Erro inesperado";
    if (message) error.message = message;
    (error as any).status = error?.response?.status;
    return Promise.reject(error);
  }
);
