import { useEffect, useState } from "react";

import { apiFetch } from "../services/api";

export default function MojeRezerwacjePage() {
  const [reservations, setReservations] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await apiFetch("/api/reservations/me");

        if (!response.ok) {
          throw new Error("Błąd podczas ładowania rezerwacji");
        }

        const data = await response.json();
        setReservations(data);
      } catch {
        setReservations([]);
      }
    };

    const loadMovies = async () => {
      try {
        const response = await fetch("/api/movies");

        if (!response.ok) {
          throw new Error("Błąd podczas ładowania filmów");
        }

        const data = await response.json();
        setMovies(data);
      } catch {
        setMovies([]);
      }
    };

    loadReservations();
    loadMovies();
  }, []);

  const getMovieTitle = (movieId) => {
    const movie = movies.find((item) => item.id === movieId);

    return movie ? movie.title : `ID: ${movieId}`;
  };

  const handleDelete = async (id) => {
    try {
      const response = await apiFetch(
        `/api/reservations/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania rezerwacji");
      }

      setReservations((previousReservations) =>
        previousReservations.filter(
          (reservation) => reservation.id !== id
        )
      );
    } catch {
      alert("Błąd podczas usuwania rezerwacji");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Twoje rezerwacje
      </h2>

      {reservations.length === 0 ? (
        <p className="text-center text-gray-500">
          Brak rezerwacji.
        </p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li
              key={reservation.id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Film:</strong>{" "}
                  {getMovieTitle(reservation.movieId)}
                </p>

                <p>
                  <strong>Godzina:</strong>{" "}
                  {reservation.time}
                </p>

                <p>
                  <strong>Miejsca:</strong>{" "}
                  {reservation.seats.join(", ")}
                </p>
              </div>

              <button
                onClick={() =>
                  handleDelete(reservation.id)
                }
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