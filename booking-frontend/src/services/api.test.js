import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import { apiFetch } from "./api";

const originalFetch = globalThis.fetch;

describe("apiFetch", () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("adds Bearer token to authenticated requests", async () => {
    localStorage.setItem("token", "jwt-token");

    globalThis.fetch.mockResolvedValue({
      status: 200,
    });

    await apiFetch("/api/reservations/me", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const [url, options] = globalThis.fetch.mock.calls[0];

    expect(url).toBe("/api/reservations/me");
    expect(options.headers.get("Authorization"))
      .toBe("Bearer jwt-token");
    expect(options.headers.get("Content-Type"))
      .toBe("application/json");
  });

  test("does not add Authorization header without a token", async () => {
    globalThis.fetch.mockResolvedValue({
      status: 200,
    });

    await apiFetch("/api/movies");

    const [, options] = globalThis.fetch.mock.calls[0];

    expect(options.headers.has("Authorization")).toBe(false);
  });

  test("clears authentication after 401 from protected endpoint", async () => {
    localStorage.setItem("token", "jwt-token");
    localStorage.setItem("email", "user@example.com");

    globalThis.fetch.mockResolvedValue({
      status: 401,
    });

    await apiFetch("/api/reservations/me");

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("email")).toBeNull();
  });

  test("does not clear authentication after 401 from auth endpoint", async () => {
    localStorage.setItem("token", "jwt-token");
    localStorage.setItem("email", "user@example.com");

    globalThis.fetch.mockResolvedValue({
      status: 401,
    });

    await apiFetch("/api/auth/login");

    expect(localStorage.getItem("token")).toBe("jwt-token");
    expect(localStorage.getItem("email")).toBe("user@example.com");
  });
});