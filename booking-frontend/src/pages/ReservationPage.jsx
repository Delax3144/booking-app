import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { apiFetch } from "../services/api";

export default function ReservationPage() {
  const { movieId, time } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  useEffect(() => {
    fetch(
      `/api/reservations/occupied?movieId=${movieId}&time=${time}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nie udało się pobrać zajętych miejsc");
        }

        return res.json();
      })
      .then(setOccupiedSeats)
      .catch(() => setOccupiedSeats([]));
  }, [movieId, time]);

  useEffect(() => {
    const totalSeats = 30;

    const generatedSeats = Array.from(
      { length: totalSeats },
      (_, index) => {
        const seatId = index + 1;

        return {
          id: seatId,
          taken: occupiedSeats.includes(seatId),
        };
      }
    );

    setSeats(generatedSeats);
  }, [occupiedSeats]);

  const toggleSeat = (seatId) => {
    const seat = seats.find((item) => item.id === seatId);

    if (seat?.taken) {
      return;
    }

    setSelectedSeats((previousSeats) =>
      previousSeats.includes(seatId)
        ? previousSeats.filter((id) => id !== seatId)
        : [...previousSeats, seatId]
    );
  };

  const handleReservation = async () => {
    if (selectedSeats.length === 0) {
      return;
    }

    const reservation = {
      movieId: Number(movieId),
      time,
      seats: selectedSeats,
    };

    try {
      const response = await apiFetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zapisać rezerwacji");
      }

      alert("Rezerwacja zapisana!");

      setSelectedSeats([]);
      navigate("/moje-rezerwacje");
    } catch {
      alert("Błąd podczas rezerwacji.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Rezerwacja miejsc
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Film ID: {movieId} | Godzina: {time}
        </p>

        <div className="grid grid-cols-6 gap-3 justify-center mb-6">
          {seats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => toggleSeat(seat.id)}
              disabled={seat.taken}
              className={`w-12 h-12 rounded font-medium border ${
                seat.taken
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : selectedSeats.includes(seat.id)
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-blue-100"
              }`}
            >
              {seat.id}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-6 text-sm text-gray-700 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded" />
            Wolne
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            Wybrane
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded" />
            Zajęte
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleReservation}
            disabled={selectedSeats.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Zarezerwuj{" "}
            {selectedSeats.length > 0 &&
              `(${selectedSeats.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}