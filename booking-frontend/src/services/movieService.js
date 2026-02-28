export async function getMovies() {
  const response = await fetch("http://localhost:8080/api/movies");
  if (!response.ok) {
    throw new Error("Błąd podczas pobierania filmów");
  }
  return await response.json();
}
