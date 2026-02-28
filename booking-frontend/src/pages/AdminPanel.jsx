import { useEffect, useState } from "react";
import MovieForm from "./admin/MovieForm";

export default function AdminPanel() {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const res = await fetch("http://localhost:8080/api/movies");
    const data = await res.json();
    setMovies(data);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/movies/${id}`, {
      method: "DELETE"
    });
    fetchMovies();
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel administratora</h1>

      <MovieForm onMovieAdded={fetchMovies} />

      <h2 className="text-xl font-semibold mt-8">Lista filmów</h2>
      <ul className="divide-y">
        {movies.map((movie) => (
          <li key={movie.id} className="py-2 flex justify-between items-center">
            <div>
              <strong>{movie.title}</strong> — {movie.description}
            </div>
            <button className="text-red-600" onClick={() => handleDelete(movie.id)}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
