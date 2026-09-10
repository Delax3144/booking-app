import { Navigate } from "react-router-dom";

import {
  getEmail,
  isAuthenticated,
} from "../utils/auth";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/logowanie"
        replace
      />
    );
  }

  if (
    adminOnly &&
    getEmail() !== "admin@gmail.com"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}