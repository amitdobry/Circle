import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/index";
import { AvatarInfo } from "../types/avatar";
import { SessionConfig } from "../utils/sessionConfig";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSaveProfile = async () => {
    if (!name || !selectedAvatarId) {
      setErrorMessage("Please enter your name and select an avatar");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const token = SessionConfig.getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const { SOCKET_SERVER_URL } = await import("../config");
      const API_BASE_URL =
        process.env.REACT_APP_SERVER_URL || SOCKET_SERVER_URL;

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          avatar: selectedAvatarId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      console.log("Profile updated successfully");

      // Navigate back to homepage
      navigate("/");
    } catch (error) {
      console.error("Profile update failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save profile"
      );
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-rose-100 text-gray-800 flex flex-col items-center justify-center px-4 py-12 relative">
      <h1 className="text-3xl font-bold mb-4">Complete Your Profile</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Choose your Circle name and avatar to join conversations
      </p>

      <input
        type="text"
        placeholder="Enter your Circle name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-6 px-4 py-2 rounded-md border shadow-sm text-lg w-64 text-center"
        disabled={isLoading}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-5xl mx-auto mb-6">
        {avatars.map((avatar) => {
          const isTaken = Boolean(avatar.takenBy);
          const isSelected = selectedAvatarId === avatar.id;

          return (
            <button
              key={avatar.id}
              onClick={() =>
                !isTaken && !isLoading ? setSelectedAvatarId(avatar.id) : null
              }
              disabled={isTaken || isLoading}
              className={`flex flex-col items-center p-3 rounded-xl shadow transition-transform
                ${
                  isTaken || isLoading
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

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          disabled={isLoading}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>

        <button
          onClick={handleSaveProfile}
          disabled={isLoading}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Error Toast */}
      {showError && (
        <div className="fixed bottom-20 bg-red-100 border border-red-300 text-red-700 px-12 py-3 rounded-lg shadow-lg text-center text-sm animate-bounce">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
