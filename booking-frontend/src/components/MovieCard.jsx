import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleTimeClick = (time) => {
    navigate(`/rezerwacja/${movie.id}/${time}`);
  };

  return (
    <Card className="overflow-hidden shadow-xl">
      <img
        src={movie.imageUrl}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-1">{movie.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{movie.description}</p>
        <div className="flex flex-wrap gap-2">
          {movie.showtimes.map((time, idx) => (
            <Button key={idx} onClick={() => handleTimeClick(time)}>
              {time}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
