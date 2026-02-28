import { useState } from "react";

export default function MovieForm({ onMovieAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showtimes, setShowtimes] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movie = {
      title,
      description,
      showtimes: showtimes.split(",").map(s => s.trim()),
      imageUrl
    };

    const res = await fetch("http://localhost:8080/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie)
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setShowtimes("");
      setImageUrl("");
      onMovieAdded();
    }
  };

  return (
    <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold">Dodaj nowy film</h2>
      <input className="border p-2 w-full" placeholder="Tytuł" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full" placeholder="Opis" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Godziny seansów (np. 14:00, 18:00)" value={showtimes} onChange={(e) => setShowtimes(e.target.value)} />
      <input className="border p-2 w-full" placeholder="URL obrazka" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Dodaj</button>
    </form>
  );
}
