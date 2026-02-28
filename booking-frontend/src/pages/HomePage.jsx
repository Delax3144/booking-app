import React from "react";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      }}
    >
      <div className="bg-white/80 rounded-lg p-10 max-w-md text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-pink-600">Witaj w KinoApp</h1>
        <p className="text-gray-700 mb-6">
          System rezerwacji biletów kinowych. Zaloguj się, aby przeglądać filmy i rezerwować miejsca.
        </p>
        <p className="text-sm text-gray-500">
          Wszystkie operacje dostępne po zalogowaniu się w górnym menu.
        </p>
      </div>
    </div>
  );
}
