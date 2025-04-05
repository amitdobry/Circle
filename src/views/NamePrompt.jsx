import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NamePrompt() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    navigate(`/room?mode=participant&name=${encodeURIComponent(name.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-rose-100 text-gray-800 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Choose Your Name</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="px-4 py-3 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold text-lg shadow hover:bg-emerald-600 transition">
          Enter Circle
        </button>
      </form>
    </div>
  );
}
