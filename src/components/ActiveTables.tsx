import React, { useState, useEffect } from "react";
import { SOCKET_SERVER_URL } from "../config";
import socket from "../socket/index";
import { useTableDefinitions } from "../hooks/useTableDefinitions";
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
  const { tables, fetchTableDefinitions } = useTableDefinitions();

  // Fetch table definitions on mount
  useEffect(() => {
    fetchTableDefinitions();
  }, [fetchTableDefinitions]);

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

  // Listen for socket updates
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

  // Merge table definitions with runtime rooms
  const mergedTables = tables.map((def) => {
    const runtime = rooms.find((r) => r.roomId === def.tableId);
    return {
      ...def,
      ...(runtime || {}),
      // Provide defaults if no runtime
      participantCount: runtime?.participantCount || 0,
      maxCapacity: runtime?.maxCapacity || 8,
      status: (runtime?.status || "waiting") as "active" | "waiting",
      currentSpeaker: runtime?.currentSpeaker || null,
      timer: runtime?.timer || { speakerTime: 0, sessionTime: 0 },
    };
  });

  // Also include any runtime rooms that don't match definitions
  const unmatchedRooms = rooms.filter(
    (room) => !tables.some((def) => def.tableId === room.roomId),
  );

  const allTables = [...mergedTables, ...unmatchedRooms];

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto pt-2 pb-8">
        <div className="text-center text-gray-500">
          <div className="animate-pulse">Loading active circles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto pt-2 pb-8">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pt-2 pb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {tables.length > 0
          ? "Choose a Circle"
          : `Active Soul Circles (${rooms.length})`}
      </h2>

      {allTables.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow text-center text-gray-600">
          <p className="text-lg mb-2">✨ No active circles yet</p>
          <p className="text-sm text-gray-500">
            Be the first to start a circle!
          </p>
        </div>
      ) : (
        <>
          {/* Vertical scrollable grid - shows 1 row at a time, max 3 cards */}
          <div className="custom-scrollbar overflow-y-auto max-h-[280px] pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {allTables.map((table: any) => (
                <TableCard
                  key={table.tableId || table.roomId}
                  tableId={table.tableId}
                  name={table.name}
                  icon={table.icon}
                  description={table.description}
                  roomId={table.roomId}
                  sessionId={table.sessionId}
                  participantCount={table.participantCount}
                  maxCapacity={table.maxCapacity}
                  status={table.status}
                  currentSpeaker={table.currentSpeaker}
                  timer={table.timer}
                  createdAt={table.createdAt}
                  // Remove legacy handlers - cards now handle navigation directly
                  // onTakeSeat={handleTakeSeat}
                  // onObserve={handleObserve}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            <span className="inline-block animate-pulse">●</span> Live updates
            every 5 seconds
          </div>
        </>
      )}
    </div>
  );
}
