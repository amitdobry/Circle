import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket/index";
import { AvatarInfo } from "../types/avatar";

export default function NamePrompt() {
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId?: string }>();

  const [name, setName] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);

  const [showError, setShowError] = useState(false); // <-- NEW state for toast
  const [errorMessage, setErrorMessage] = useState(""); // <-- NEW!
  const errorTimeoutRef = useRef<number | null>(null);

  // Helper to show error with auto-hide
  const showErrorMessage = useCallback((message: string) => {
    // Clear any existing timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setErrorMessage(message);
    setShowError(true);

    const timeout = window.setTimeout(() => {
      setShowError(false);
    }, 3000);

    errorTimeoutRef.current = timeout;
  }, []);

  // Fetch avatars on load
  useEffect(() => {
    console.log(
      `🔄 [NamePrompt] Requesting avatars from server for table: ${tableId || "default-room"}...`,
    );
    socket.emit("get-avatars", { tableId: tableId || undefined });

    socket.on("avatars", (list) => {
      console.log("🎯 [NamePrompt] Received avatars from server:", list);
      const enriched = list.map((a: any) => ({
        ...a,
        image: `${process.env.PUBLIC_URL}/avatars/avatar-${a.id}.png`,
      }));
      console.log(
        "🖼️ [NamePrompt] Enriched avatars with local images:",
        enriched,
      );
      setAvatars(enriched);
    });

    return () => {
      socket.off("avatars");
    };
  }, [tableId]); // Re-fetch if tableId changes

  // Set up join response listeners
  useEffect(() => {
    const handleJoinApproved = () => {
      console.log("✅ [NamePrompt] Join approved");
      // Clear any error timeouts
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      // Navigate to table room or default room
      const targetRoute = tableId
        ? `/room?mode=participant&name=${encodeURIComponent(name)}&tableId=${tableId}`
        : `/room?mode=participant&name=${encodeURIComponent(name)}`;
      navigate(targetRoute);
    };

    const handleJoinRejected = ({ reason }: { reason: string }) => {
      console.log("🚫 [NamePrompt] Join rejected:", reason);
      showErrorMessage(reason || "Unable to join. Please try again.");
    };

    socket.on("join-approved", handleJoinApproved);
    socket.on("join-rejected", handleJoinRejected);

    return () => {
      socket.off("join-approved", handleJoinApproved);
      socket.off("join-rejected", handleJoinRejected);
    };
  }, [tableId, name, navigate, showErrorMessage]);

  const handleJoin = () => {
    if (!name || !selectedAvatarId) {
      // ❌ Missing fields → show warning toast
      showErrorMessage("Please enter your name and select an avatar");
      return;
    }

    console.log(`🎯 [NamePrompt] Joining table: ${tableId || "default-room"}`);

    // 🔥 Ask server for permission
    socket.emit("request-join", {
      name,
      avatarId: selectedAvatarId,
      tableId: tableId || undefined, // Pass tableId if available
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-rose-100 text-gray-800 flex flex-col items-center justify-center px-4 py-12 relative">
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
        className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-emerald-700">
        Join Circle
      </button>

      {/* --- Toast Message --- */}
      {showError && (
        <div className="fixed bottom-20 bg-yellow-300 text-yellow-900 px-12 py-3 rounded-lg shadow-lg text-center text-sm animate-bounce">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
