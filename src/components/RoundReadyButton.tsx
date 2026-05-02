import React from "react";
import socket from "../socket";

type RoundReadyButtonProps = {
  isReady: boolean;
};

/**
 * RoundReadyButton - Personal action button for marking readiness for the next question
 * Text changes based on current ready state:
 * - "Ready for next question" when not ready
 * - "✓ Ready" when ready (not "Waiting for others..." to avoid redundancy with indicator)
 */
export default function RoundReadyButton({ isReady }: RoundReadyButtonProps) {
  const handleToggleReady = () => {
    if (isReady) {
      socket.emit("round:unready");
    } else {
      socket.emit("round:ready");
    }
  };

  return (
    <button
      data-testid="round-ready-button"
      data-is-ready={isReady}
      onClick={handleToggleReady}
      className={`
        group px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
        ${
          isReady
            ? "bg-emerald-600 text-white shadow-lg hover:bg-emerald-100 hover:text-emerald-800 hover:border-2 hover:border-emerald-400"
            : "bg-white text-emerald-700 border-2 border-emerald-600 hover:bg-emerald-50"
        }
      `}>
      {isReady ? (
        <>
          <span className="group-hover:hidden">✓ Ready</span>
          <span className="hidden group-hover:inline">✕ Undo ready</span>
        </>
      ) : (
        "Ready for next question"
      )}
    </button>
  );
}
