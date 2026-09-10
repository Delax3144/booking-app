import { useState } from "react";

import { apiFetch } from "../../services/api";

export default function MovieForm({ onMovieAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showtimes, setShowtimes] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const movie = {
      title,
      description,
      showtimes: showtimes
        .split(",")
        .map((showtime) => showtime.trim())
        .filter(Boolean),
      imageUrl,
    };

    try {
      const response = await apiFetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      if (!response.ok) {
        throw new Error("Nie udało się dodać filmu");
      }

      setTitle("");
      setDescription("");
      setShowtimes("");
      setImageUrl("");

      onMovieAdded();
    } catch {
      alert("Brak uprawnień lub błąd podczas dodawania filmu.");
    }
  };

  return (
    <form
      className="space-y-4 mb-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold">
        Dodaj nowy film
      </h2>

      <input
        className="border p-2 w-full"
        placeholder="Tytuł"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Opis"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="Godziny seansów (np. 14:00, 18:00)"
        value={showtimes}
        onChange={(event) =>
          setShowtimes(event.target.value)
        }
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="URL obrazka"
        value={imageUrl}
        onChange={(event) => setImageUrl(event.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Dodaj
      </button>
    </form>
  );
}