import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReservationPage from "./pages/ReservationPage";
import MojeRezerwacjePage from "./pages/MojeRezerwacjePage";
import FilmyPage from "./pages/FilmyPage";
import AdminPanel from "./pages/AdminPanel";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";

export default function App() {
  const email = localStorage.getItem("email");

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logowanie" element={<AuthPage />} />
        <Route path="/rezerwacja/:movieId/:time" element={<ReservationPage />} />

        {email && (
          <>
            <Route path="/moje-rezerwacje" element={<MojeRezerwacjePage />} />
            <Route path="/filmy" element={<FilmyPage />} />
            {email === "admin@gmail.com" && (
              <Route path="/admin" element={<AdminPanel />} />
            )}
          </>
        )}
      </Routes>
    </Router>
  );
}
