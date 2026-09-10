import {
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";

import {
  getEmail,
  getToken,
  isAuthenticated,
  logout,
  saveAuth,
} from "./auth";

describe("auth utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("saves email and JWT token", () => {
    saveAuth({
      email: "user@example.com",
      token: "jwt-token",
    });

    expect(getEmail()).toBe("user@example.com");
    expect(getToken()).toBe("jwt-token");
  });

  test("reports authentication based on token presence", () => {
    expect(isAuthenticated()).toBe(false);

    localStorage.setItem("token", "jwt-token");

    expect(isAuthenticated()).toBe(true);
  });

  test("logout removes authentication data", () => {
    saveAuth({
      email: "user@example.com",
      token: "jwt-token",
    });

    logout();

    expect(getEmail()).toBeNull();
    expect(getToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});