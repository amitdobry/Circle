import React, { useState, useEffect, useRef } from "react";
import socket from "../socket/index";

type Props = {
  readyCount: number;
  totalCount: number;
  isReady: boolean;
};

const TOOLTIP_KEY = "readiness_tooltip_seen";

export default function MobileReadinessIndicator({
  readyCount,
  totalCount,
  isReady,
}: Props) {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  // Show first-time tooltip once per browser session
  useEffect(() => {
    const seen = sessionStorage.getItem(TOOLTIP_KEY);
    if (!seen) setShowTooltip(true);
  }, []);

  const handlePillTap = () => {
    if (showTooltip) return; // tooltip takes priority
    setOpen((prev) => !prev);
  };

  const handleGotIt = () => {
    sessionStorage.setItem(TOOLTIP_KEY, "1");
    setShowTooltip(false);
    // do NOT auto-open popover — user can tap pill when ready
  };

  const handleReady = () => {
    socket.emit("round:ready");
    setOpen(false);
  };

  const handleNotReady = () => {
    socket.emit("round:unready"); // server handles no-op if already not ready
    setOpen(false);
  };

  // Close popover on outside tap — but NOT when tapping the pill itself (pill handles its own toggle)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const insidePopover = popoverRef.current?.contains(target);
      const insidePill = pillRef.current?.contains(target);
      if (!insidePopover && !insidePill) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const allReady = totalCount > 0 && readyCount === totalCount;
  const waiting = totalCount - readyCount;

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-1">
      {/* Persistent pill */}
      <button
        ref={pillRef}
        onClick={handlePillTap}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md text-white text-sm font-semibold
          transition-all duration-200 select-none
          ${allReady ? "bg-emerald-400 scale-105" : isReady ? "bg-emerald-500" : "bg-emerald-600"}
        `}
        aria-label={`${readyCount} of ${totalCount} ready for next question`}>
        <span className="text-xs">👥</span>
        <span>
          {readyCount}/{totalCount}
        </span>
      </button>

      {/* First-time tooltip */}
      {showTooltip && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-52 text-center mt-1">
          <p className="text-sm text-gray-700 leading-snug mb-3">
            Let others know when you're ready to move to the next question.
          </p>
          <button
            onClick={handleGotIt}
            className="text-emerald-600 font-semibold text-sm">
            Got it
          </button>
        </div>
      )}

      {/* Quick action popover */}
      {open && !showTooltip && (
        <div
          ref={popoverRef}
          className="bg-white rounded-2xl border border-gray-100 p-4 w-56 mt-1"
          style={{ boxShadow: "0px 8px 24px rgba(0,0,0,0.12)" }}>
          {/* I'm ready */}
          <button
            onClick={handleReady}
            disabled={isReady}
            className={`
              w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm mb-2
              transition-all duration-200
              ${
                isReady
                  ? "bg-emerald-500 text-white opacity-80 cursor-default"
                  : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white"
              }
            `}>
            <span>✓</span>
            <span>{isReady ? "You are ready" : "I'm ready"}</span>
          </button>

          {/* I'm not ready */}
          <button
            onClick={handleNotReady}
            className={`
              w-full flex items-center justify-center gap-2 py-2 rounded-full font-medium text-sm border
              transition-all duration-200
              ${
                isReady
                  ? "border-gray-200 text-gray-400 hover:bg-gray-50"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 active:scale-95"
              }
            `}>
            <span>✕</span>
            <span>I'm not ready</span>
          </button>

          {/* Subtitle */}
          <p className="text-center text-xs text-gray-400 mt-3 leading-snug">
            When everyone is ready, we'll move to the next question together.
          </p>

          {/* Waiting feedback */}
          {isReady && waiting > 0 && (
            <p className="text-center text-xs text-emerald-600 font-medium mt-2">
              Waiting for {waiting} more {waiting === 1 ? "person" : "people"}
            </p>
          )}

          {/* All ready */}
          {allReady && (
            <p className="text-center text-xs text-emerald-600 font-semibold mt-2">
              ✓ Everyone is ready!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
