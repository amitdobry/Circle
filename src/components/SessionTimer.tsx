import React, { useState, useEffect } from "react";
import socket from "../socket/index";

interface SessionTimerProps {
  onSessionEnd?: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ onSessionEnd }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [sessionActive, setSessionActive] = useState<boolean>(false);

  useEffect(() => {
    // Listen for session timer updates from server
    const handleSessionTimer = (data: {
      remainingSeconds: number;
      remainingMinutes: number;
      remainingSecondsDisplay: number;
      totalSeconds: number;
      elapsedSeconds: number;
      isActive: boolean;
    }) => {
      setTimeRemaining(data.remainingSeconds || 0);
      setTotalDuration(data.totalSeconds || 0);
      setSessionActive(data.isActive || false);

      if (data.remainingSeconds <= 0 && data.isActive && onSessionEnd) {
        onSessionEnd();
      }
    };

    const handleSessionEnded = () => {
      setSessionActive(false);
      setTimeRemaining(0);
      if (onSessionEnd) {
        onSessionEnd();
      }
    };

    socket.on("session-timer", handleSessionTimer);
    socket.on("session-ended", handleSessionEnded);

    return () => {
      socket.off("session-timer", handleSessionTimer);
      socket.off("session-ended", handleSessionEnded);
    };
  }, [onSessionEnd]);

  if (!sessionActive || totalDuration === 0) {
    return null;
  }

  const progressPercentage = (timeRemaining / totalDuration) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Color coding based on time remaining
  let barColor = "bg-green-500";
  if (timeRemaining <= 60) {
    // Last minute
    barColor = "bg-red-500";
  } else if (timeRemaining <= 300) {
    // Last 5 minutes
    barColor = "bg-orange-500";
  } else if (timeRemaining <= 900) {
    // Last 15 minutes
    barColor = "bg-yellow-500";
  }

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <div className="relative bg-gray-200 rounded-lg h-8 overflow-hidden">
        <div
          className={`${barColor} h-full transition-all duration-300 flex items-center justify-center`}
          style={{ width: `${Math.max(progressPercentage, 0)}%` }}>
          <span className="text-white font-semibold text-sm">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
        {progressPercentage < 50 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-700 font-semibold text-sm">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTimer;
