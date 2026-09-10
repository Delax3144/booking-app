import {
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  render,
  screen,
} from "@testing-library/react";

import ProtectedRoute from "./ProtectedRoute";

function renderProtectedRoute({ adminOnly = false } = {}) {
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route
          path="/"
          element={<div>Home page</div>}
        />

        <Route
          path="/logowanie"
          element={<div>Login page</div>}
        />

        <Route
          path="/protected"
          element={
            <ProtectedRoute adminOnly={adminOnly}>
              <div>Protected content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("redirects unauthenticated user to login page", () => {
    renderProtectedRoute();

    expect(
      screen.getByText("Login page")
    ).toBeInTheDocument();
  });

  test("allows authenticated user to access protected route", () => {
    localStorage.setItem("token", "jwt-token");
    localStorage.setItem("email", "user@example.com");

    renderProtectedRoute();

    expect(
      screen.getByText("Protected content")
    ).toBeInTheDocument();
  });

  test("redirects non-admin user from admin route", () => {
    localStorage.setItem("token", "jwt-token");
    localStorage.setItem("email", "user@example.com");

    renderProtectedRoute({
      adminOnly: true,
    });

    expect(
      screen.getByText("Home page")
    ).toBeInTheDocument();
  });

  test("allows admin user to access admin route", () => {
    localStorage.setItem("token", "jwt-token");
    localStorage.setItem("email", "admin@gmail.com");

    renderProtectedRoute({
      adminOnly: true,
    });

    expect(
      screen.getByText("Protected content")
    ).toBeInTheDocument();
  });
});