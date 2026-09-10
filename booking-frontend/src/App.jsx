import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import AdminPanel from "./pages/AdminPanel";
import AuthPage from "./pages/AuthPage";
import FilmyPage from "./pages/FilmyPage";
import HomePage from "./pages/HomePage";
import MojeRezerwacjePage from "./pages/MojeRezerwacjePage";
import ReservationPage from "./pages/ReservationPage";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/logowanie"
          element={<AuthPage />}
        />

        <Route
          path="/filmy"
          element={
            <ProtectedRoute>
              <FilmyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rezerwacja/:movieId/:time"
          element={
            <ProtectedRoute>
              <ReservationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/moje-rezerwacje"
          element={
            <ProtectedRoute>
              <MojeRezerwacjePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}