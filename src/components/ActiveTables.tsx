import React, { useState, useEffect } from "react";
import { SOCKET_SERVER_URL } from "../config";
import socket from "../socket/index";
import TableCard from "./TableCard";

interface Room {
  roomId: string;
  sessionId: string;
  participantCount: number;
  maxCapacity: number;
  status: "active" | "waiting";
  currentSpeaker: {
    socketId: string;
    name: string;
    avatar: number;
  } | null;
  timer: {
    speakerTime: number;
    sessionTime: number;
  };
  createdAt: string;
}

export default function ActiveTables() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch active rooms
  const fetchRooms = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_SERVER_URL || SOCKET_SERVER_URL;
      const response = await fetch(`${API_BASE_URL}/api/rooms/active`);

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();
      setRooms(data.rooms || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError(err instanceof Error ? err.message : "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRooms();

    // Set up polling for updates (every 5 seconds)
    const interval = setInterval(fetchRooms, 5000);

    return () => clearInterval(interval);
  }, []);

  // Listen for socket updates (Phase 1: not implemented yet, but ready)
  useEffect(() => {
    const handleRoomsUpdate = (data: { rooms: Room[] }) => {
      console.log("🔄 [ActiveTables] Rooms updated via socket:", data);
      setRooms(data.rooms || []);
    };

    socket.on("rooms:list", handleRoomsUpdate);

    return () => {
      socket.off("rooms:list", handleRoomsUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-8">
        <div className="text-center text-gray-500">
          <div className="animate-pulse">Loading active circles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto py-8">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto py-8">
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow text-center text-gray-600">
          <p className="text-lg mb-2">✨ No active circles yet</p>
          <p className="text-sm text-gray-500">
            Be the first to start a circle!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Active Soul Circles ({rooms.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <TableCard
            key={room.roomId}
            roomId={room.roomId}
            sessionId={room.sessionId}
            participantCount={room.participantCount}
            maxCapacity={room.maxCapacity}
            status={room.status}
            currentSpeaker={room.currentSpeaker}
            timer={room.timer}
            createdAt={room.createdAt}
          />
        ))}
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        <span className="inline-block animate-pulse">●</span> Live updates every
        5 seconds
      </div>
    </div>
  );
}
