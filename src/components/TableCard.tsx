import React from "react";

interface TableCardProps {
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
  onJoin?: () => void;
}

export default function TableCard({
  roomId,
  participantCount,
  maxCapacity,
  status,
  currentSpeaker,
  timer,
  onJoin,
}: TableCardProps) {
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
      {/* Room ID Badge */}
      <div className="text-xs font-mono text-gray-500 mb-2 truncate">
        {roomId}
      </div>

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
      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}>
          {status === "active" ? "🟢 Active" : "⏸️ Waiting"}
        </span>

        {/* Join Button (future) */}
        {onJoin && (
          <button
            onClick={onJoin}
            className="text-xs px-3 py-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition">
            Join
          </button>
        )}
      </div>
    </div>
  );
}
