import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/index"; // update path as needed
import { AvatarInfo } from "../types/avatar"; // ✅ Removed .ts

export default function NamePrompt() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);

  // Fetch avatars on load
  useEffect(() => {
    socket.emit("get-avatars");
    socket.on("avatars", (list) => {
      const enriched = list.map((a: any) => ({
        ...a,
        image: `${process.env.PUBLIC_URL}/avatars/avatar-${a.id}.png`,
      }));
      setAvatars(enriched);
    });

    return () => {
      socket.off("avatars");
    };
  }, []);

  const handleJoin = () => {
    if (!name || !selectedAvatarId) return;

    socket.emit("join", { name, avatarId: selectedAvatarId });

    navigate(`/room?mode=participant&name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-rose-100 text-gray-800 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Join the Circle</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-6 px-4 py-2 rounded-md border shadow-sm text-lg w-64 text-center"
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-5xl mx-auto mb-6">
        {avatars.map((avatar) => {
          const isTaken = Boolean(avatar.takenBy);
          const isSelected = selectedAvatarId === avatar.id;

          return (
            <button
              key={avatar.id}
              onClick={() => (!isTaken ? setSelectedAvatarId(avatar.id) : null)}
              disabled={isTaken}
              className={`flex flex-col items-center p-3 rounded-xl shadow transition-transform
                ${
                  isTaken
                    ? "bg-gray-200 opacity-50 cursor-not-allowed"
                    : "bg-white hover:scale-105 hover:shadow-lg"
                }
                ${isSelected ? "ring-4 ring-emerald-400" : ""}`}>
              <img
                src={avatar.image}
                alt={avatar.id}
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
              <span className="text-sm font-medium">
                {avatar.id}
                {isTaken ? " ❌" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleJoin}
        disabled={!name || !selectedAvatarId}
        className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-emerald-700 disabled:opacity-50">
        Join Circle
      </button>
    </div>
  );
}
