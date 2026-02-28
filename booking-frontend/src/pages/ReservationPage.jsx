import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReservationPage() {
  const { movieId, time } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch(`http://localhost:8080/api/reservations/occupied?movieId=${movieId}&time=${time}`)
      .then((res) => res.json())
      .then((data) => {
        setOccupiedSeats(data);
      });
  }, [movieId, time]);

  useEffect(() => {
    const totalSeats = 30;
    const generated = Array.from({ length: totalSeats }, (_, i) => ({
      id: i + 1,
      taken: occupiedSeats.includes(i + 1),
    }));
    setSeats(generated);
  }, [occupiedSeats]);

  const toggleSeat = (seatId) => {
    if (seats.find((s) => s.id === seatId)?.taken) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleReservation = () => {
    const reservation = {
  movieId: parseInt(movieId),
  time,
  seats: selectedSeats,
  userEmail: localStorage.getItem("email") || "test@example.com",
};


    fetch("http://localhost:8080/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Rezerwacja zapisana!");
        setSelectedSeats([]);
        navigate("/moje-rezerwacje");
      })
      .catch(() => alert("Błąd podczas rezerwacji."));
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
              className={`w-12 h-12 rounded font-medium border 
                ${
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
            <div className="w-4 h-4 border rounded"></div>
            Wolne
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            Wybrane
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            Zajęte
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleReservation}
            disabled={selectedSeats.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Zarezerwuj {selectedSeats.length > 0 && `(${selectedSeats.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
