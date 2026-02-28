// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const success = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Nieprawidłowy email lub hasło");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Card className="w-full max-w-sm mx-auto mt-32 shadow-xl bg-white/80 backdrop-blur-lg">
  <CardContent className="p-6">
    <h2 className="text-lg font-bold mb-4 text-center">Zaloguj się</h2>
    <div className="space-y-4">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Hasło" />
      <Button className="w-full">Zaloguj się</Button>
    </div>
  </CardContent>
</Card>

    </div>
  );
}
