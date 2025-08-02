import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { APP_VERSION } from "./../version";
import LoginPage from "./LoginPage";
import { SessionConfig } from "../utils/sessionConfig";
import { authService } from "../services/authService";
import socket from "../socket/index";

(window as any).APP_VERSION = APP_VERSION;
export default function HomePage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useTabSessions, setUseTabSessions] = useState(
    SessionConfig.useTabSessions
  );
  const [authCheckTrigger, setAuthCheckTrigger] = useState(0);

  // Update global session config when toggle changes
  const handleSessionModeToggle = () => {
    const newMode = !useTabSessions;
    setUseTabSessions(newMode);
    SessionConfig.setMode(newMode);
  };

  // Logout function
  const handleLogout = () => {
    authService.logout();
    setUserProfile(null);
    setIsGuest(true);
    console.log("User logged out");
  };

  // Handle login modal close and trigger auth recheck
  const handleLoginClose = () => {
    setShowLogin(false);
    // Trigger auth check after login modal closes
    setAuthCheckTrigger((prev) => prev + 1);
  };

  // Handle logged-in user joining the circle
  const handleJoinAsLoggedUser = () => {
    if (!userProfile?.name || !userProfile?.avatarId) {
      console.error("❌ Cannot join: Missing name or avatar");
      return;
    }

    console.log("🚀 [HomePage] Logged user joining circle:", {
      name: userProfile.name,
      avatar: userProfile.avatarId,
    });

    // Request join with user's profile data (same as guest flow)
    socket.emit("request-join", {
      name: userProfile.name,
      avatarId: userProfile.avatarId,
    });

    // Listen for join approval
    socket.once("join-approved", () => {
      console.log("✅ [HomePage] Join approved, navigating to room");
      navigate(
        `/room?mode=participant&name=${encodeURIComponent(userProfile.name)}`
      );
    });

    socket.once("join-rejected", ({ reason }) => {
      console.error("❌ [HomePage] Join rejected:", reason);
      setError(reason || "Unable to join. Please try again.");
    });
  };

  // Simple user session check - only runs once
  useEffect(() => {
    console.log("🚀 [HomePage] useEffect triggered, checking session...");

    const checkUserSession = async () => {
      try {
        // Get token from authService
        const token = authService.getToken();
        console.log("🔑 [HomePage] Token check:", {
          token: token ? `${token.substring(0, 20)}...` : null,
          useTabSessions,
          sessionMode: useTabSessions ? "Tab" : "Global",
        });

        if (!token) {
          // No token - user is guest
          console.log("❌ [HomePage] No token found, setting as guest");
          setIsGuest(true);
          setIsLoading(false);
          return;
        }

        console.log("📡 [HomePage] Making API call to /api/auth/profile...");

        const { SOCKET_SERVER_URL } = await import("../config");
        const API_BASE_URL = process.env.REACT_APP_SERVER_URL || SOCKET_SERVER_URL;

        // Check profile with token from authService
        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log(
          "📊 [HomePage] API Response status:",
          response.status,
          response.ok
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("🔍 [HomePage] Profile data received:", {
          isGuest: data.isGuest,
          name: data.name,
          avatarId: data.avatarId,
          user: data.user,
          fullResponse: data,
        });

        setUserProfile(data);
        setIsGuest(data.isGuest);

        // Navigate only if profile incomplete
        if (!data.isGuest && (!data.name || !data.avatarId)) {
          console.log(
            "❌ [HomePage] Profile incomplete, navigating to /profile",
            {
              hasName: !!data.name,
              hasAvatarId: !!data.avatarId,
              name: data.name,
              avatarId: data.avatarId,
            }
          );
          navigate("/profile");
          return;
        } else {
          console.log("✅ [HomePage] Profile complete, staying on homepage", {
            name: data.name,
            avatarId: data.avatarId,
          });
        }
      } catch (err) {
        console.error("💥 [HomePage] Auth check failed:", err);
        setError(err instanceof Error ? err.message : "Auth check failed");
        setIsGuest(true);
      } finally {
        console.log(
          "🏁 [HomePage] Auth check complete, setting loading to false"
        );
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, [navigate, useTabSessions, authCheckTrigger]); // Include authCheckTrigger to re-run after login

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-rose-100 text-gray-800 flex flex-col items-center justify-center px-4 py-12">
        {/* Header with Login/Profile */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          {/* Session Mode Toggle (Dev Tool) */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-100/70 backdrop-blur-sm text-purple-700 border border-purple-300 text-xs">
            <span>{useTabSessions ? "🔗 Tab" : "🌐 Global"}:</span>
            <button
              onClick={handleSessionModeToggle}
              className={`w-8 h-4 rounded-full transition-colors ${
                useTabSessions ? "bg-purple-500" : "bg-gray-300"
              }`}>
              <div
                className={`w-3 h-3 bg-white rounded-full transition-transform ${
                  useTabSessions ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Auth Section */}
          <div>
            {isLoading ? (
              <div className="px-4 py-2 rounded-lg bg-white/70 backdrop-blur-sm text-gray-400">
                Loading...
              </div>
            ) : isGuest ? (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 rounded-lg bg-white/70 backdrop-blur-sm text-emerald-600 border border-emerald-300 font-semibold shadow hover:bg-white transition">
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-lg bg-emerald-100/70 backdrop-blur-sm text-emerald-700 border border-emerald-300 font-semibold shadow">
                  Welcome, {userProfile?.name || "User"}!
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg bg-red-100/70 backdrop-blur-sm text-red-600 border border-red-300 font-semibold shadow hover:bg-red-200 transition text-sm">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow">
            {error}
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
          {isGuest
            ? "Welcome to SoulCircle"
            : `Welcome back, ${userProfile?.name}!`}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl text-center">
          {isGuest
            ? "A sacred space for intentional presence. Speak when heard. Witness when listening. Align with the rhythm of many minds."
            : "Ready to join a circle? Choose your experience below."}
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {isGuest ? (
            <>
              <button
                onClick={() => navigate("/name")}
                className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold text-lg shadow hover:bg-emerald-600 transition">
                Take a Seat
              </button>
              <button
                onClick={() => navigate("/room?mode=observer")}
                className="px-6 py-3 rounded-lg bg-white text-emerald-600 border border-emerald-300 font-semibold text-lg shadow hover:bg-emerald-50 transition">
                Observe
              </button>
            </>
          ) : userProfile?.name && userProfile?.avatarId ? (
            <>
              <button
                onClick={handleJoinAsLoggedUser}
                className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold text-lg shadow hover:bg-emerald-600 transition">
                Join Circle as {userProfile.name}
              </button>
              <button
                onClick={() => navigate("/room?mode=observer")}
                className="px-6 py-3 rounded-lg bg-white text-emerald-600 border border-emerald-300 font-semibold text-lg shadow hover:bg-emerald-50 transition">
                Observe
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 rounded-lg bg-amber-500 text-white font-semibold text-lg shadow hover:bg-amber-600 transition">
              Complete Your Profile
            </button>
          )}

          <button
            onClick={() => navigate("/demo")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow hover:from-purple-600 hover:to-pink-600 transition">
            🎬 Run Demo
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow max-w-2xl text-center text-gray-700">
          <h2 className="text-xl font-semibold mb-2">How It Works</h2>
          <p className="text-sm mb-1">
            ✦ Join a circle as an observer or participant.
          </p>
          <p className="text-sm mb-1">
            ✦ All must point to one for that voice to be heard.
          </p>
          <p className="text-sm">
            ✦ The moment of unity becomes the moment of speech.
          </p>
        </div>

        <footer className="mt-12 text-sm text-gray-400 text-center">
          A digital ritual by design. ✦ Built with love by{" "}
          <span className="text-gray-500 font-medium">Amit Abraham Dobry</span>.{" "}
          <span className="inline-block">🌀</span> Version: {APP_VERSION}
        </footer>
      </div>

      {/* Login Modal */}
      <LoginPage isOpen={showLogin} onClose={handleLoginClose} />
    </>
  );
}
