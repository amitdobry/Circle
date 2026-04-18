import React from "react";
import { useNavigate } from "react-router-dom";

interface TableCardProps {
  // Table definition (static)
  tableId?: string;
  name?: string;
  icon?: string;
  description?: string;
  
  // Runtime state (dynamic)
  roomId?: string;
  sessionId?: string;
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
  createdAt?: string;
  onJoin?: () => void;
  onTakeSeat?: () => void;
  onObserve?: () => void;
}

export default function TableCard({
  tableId,
  name,
  icon,
  description,
  roomId,
  participantCount,
  maxCapacity,
  status,
  currentSpeaker,
  timer,
  onJoin,
  onTakeSeat,
  onObserve,
}: TableCardProps) {
  const navigate = useNavigate();
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate participant icons
  const participantIcons = Array.from(
    { length: Math.min(participantCount, maxCapacity) },
    (_, i) => (
      <span key={i} className="text-lg">
        👤
      </span>
    ),
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow border border-emerald-200 hover:border-emerald-400 transition min-w-[200px]">
      {/* Table Name & Icon (if available) OR Room ID */}
      {name && icon ? (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-base font-bold text-gray-800 truncate">{name}</h3>
        </div>
      ) : (
        <div className="text-xs font-mono text-gray-500 mb-2 truncate">
          {roomId}
        </div>
      )}

      {/* Description (if available) */}
      {description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{description}</p>
      )}

      {/* Participants */}
      <div className="flex items-center gap-1 mb-3">
        {participantIcons}
        <span className="ml-2 text-sm text-gray-600">
          {participantCount}/{maxCapacity}
        </span>
      </div>

      {/* Current Speaker */}
      <div className="mb-3">
        {currentSpeaker ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">🎤</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-emerald-700 truncate">
                {currentSpeaker.name}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(timer.speakerTime)}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic">
            {status === "waiting" ? "Waiting to start..." : "No speaker"}
          </div>
        )}
      </div>

      {/* Session Timer */}
      <div className="text-xs text-gray-500 mb-3">
        Session: {formatTime(timer.sessionTime)}
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}>
          {status === "active" ? "🟢 Active" : "⏸️ Waiting"}
        </span>
      </div>

      {/* Action Buttons */}
      {tableId ? (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/table/${tableId}`)}
            className="flex-1 px-3 py-2 rounded-lg bg-emerald-500 text-white font-semibold text-sm shadow hover:bg-emerald-600 transition">
            Join Circle
          </button>
        </div>
      ) : (onTakeSeat || onObserve) && (
        <div className="flex gap-2">
          {onTakeSeat && (
            <button
              onClick={onTakeSeat}
              className="flex-1 px-3 py-2 rounded-lg bg-emerald-500 text-white font-semibold text-sm shadow hover:bg-emerald-600 transition">
              Take a Seat
            </button>
          )}
          {onObserve && (
            <button
              onClick={onObserve}
              className="flex-1 px-3 py-2 rounded-lg bg-white text-emerald-600 border border-emerald-300 font-semibold text-sm shadow hover:bg-emerald-50 transition">
              Observe
            </button>
          )}
        </div>
      )}
    </div>
  );
}
