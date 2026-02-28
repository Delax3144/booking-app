import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import ReservationPage from "./pages/ReservationPage";
import AuthPage from "./pages/AuthPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/filmy" element={<MoviesPage />} />
        <Route path="/rezerwacja/:movieId/:time" element={<ReservationPage />} />
        <Route path="/logowanie" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}
