import React, { useState } from "react";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  async function login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Login failed");
    }
    return res.json();
  }

  async function register(email, password) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Registration failed");
    }
    return res.json();
  }

  const handleSubmit = async () => {
  setMessage(null);
  try {
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
    localStorage.setItem("email", email);
    window.location.href = "/";
  } catch (error) {
    setMessage(error.message || "Coś poszło nie tak");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
      <div className="w-full max-w-md p-6 bg-white/90 backdrop-blur-md shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Logowanie" : "Rejestracja"}
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {message && <p className="text-red-600">{message}</p>}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {isLogin ? "Zaloguj się" : "Zarejestruj się"}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? "Nie masz konta?" : "Masz już konto?"}{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                setMessage(null);
                setIsLogin(!isLogin);
              }}
            >
              {isLogin ? "Zarejestruj się" : "Zaloguj się"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
