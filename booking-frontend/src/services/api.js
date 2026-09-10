import { getToken, logout } from "../utils/auth";

export async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const isAuthRequest = url.startsWith("/api/auth/");

    if (!isAuthRequest && token) {
      logout();
    }
  }

  return response;
}