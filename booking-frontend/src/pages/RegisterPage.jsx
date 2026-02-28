// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      navigate("/logowanie");
    } else {
      setError("Rejestracja nie powiodła się");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Rejestracja</h2>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
          <Input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <Button onClick={handleRegister} className="w-full">Zarejestruj się</Button>
        </CardContent>
      </Card>
    </div>
  );
}
