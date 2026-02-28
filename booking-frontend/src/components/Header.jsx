import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/logowanie");
  };

  return (
    <header className="bg-[#0a0a0a] bg-opacity-80 text-white shadow-md border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-pink-500 tracking-wide">
          KinoApp
        </Link>

        {email ? (
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/filmy" className="hover:text-pink-400 transition">Filmy</Link>
            <Link to="/moje-rezerwacje" className="hover:text-pink-400 transition">Moje rezerwacje</Link>
            {email === "admin@gmail.com" && (
              <Link to="/admin" className="hover:text-pink-400 transition">Admin Panel</Link>
            )}
            <span className="text-gray-400 italic">{email}</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition"
            >
              Wyloguj się
            </button>
          </nav>
        ) : (
          <Link to="/logowanie" className="text-pink-400 hover:text-pink-300 transition text-sm">
            Zaloguj się / Zarejestruj się
          </Link>
        )}
      </div>
    </header>
  );
}
