import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "../services/api";
import MovieForm from "./admin/MovieForm";

export default function AdminPanel() {
  const [movies, setMovies] = useState([]);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await fetch("/api/movies");

      if (!response.ok) {
        throw new Error("Nie udało się pobrać filmów");
      }

      const data = await response.json();
      setMovies(data);
    } catch {
      setMovies([]);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await apiFetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nie udało się usunąć filmu");
      }

      setMovies((previousMovies) =>
        previousMovies.filter((movie) => movie.id !== id)
      );
    } catch {
      alert("Brak uprawnień lub błąd podczas usuwania filmu.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Panel administratora
      </h1>

      <MovieForm onMovieAdded={fetchMovies} />

      <h2 className="text-xl font-semibold mt-8">
        Lista filmów
      </h2>

      <ul className="divide-y">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="py-2 flex justify-between items-center"
          >
            <div>
              <strong>{movie.title}</strong> — {movie.description}
            </div>

            <button
              className="text-red-600"
              onClick={() => handleDelete(movie.id)}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}