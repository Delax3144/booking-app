import React, { useEffect, useState } from "react";

export default function MojeRezerwacjePage() {
  const [reservations, setReservations] = useState([]);
  const [movies, setMovies] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) return;

    // Получаем резервации по email
    fetch(`http://localhost:8080/api/reservations/user/${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Błąd podczas ładowania rezerwacji");
        return res.json();
      })
      .then(setReservations)
      .catch(() => setReservations([]));

    // Получаем список фильмов
    fetch("http://localhost:8080/api/movies")
      .then((res) => res.json())
      .then(setMovies)
      .catch(() => setMovies([]));
  }, [email]);

  const getMovieTitle = (movieId) => {
    const movie = movies.find((m) => m.id === movieId);
    return movie ? movie.title : `ID: ${movieId}`;
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/reservations/${id}`, {
        method: "DELETE",
      });
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert("Błąd podczas usuwania rezerwacji");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Twoje rezerwacje</h2>

      {reservations.length === 0 ? (
        <p className="text-center text-gray-500">Brak rezerwacji.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li
              key={r.id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Film:</strong> {getMovieTitle(r.movieId)}
                </p>
                <p>
                  <strong>Godzina:</strong> {r.time}
                </p>
                <p>
                  <strong>Miejsca:</strong> {r.seats.join(", ")}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-600 hover:underline"
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
