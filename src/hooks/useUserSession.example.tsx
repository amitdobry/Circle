// Example usage of useUserSession hook
// This would typically be in your main App component or a router component

import React from "react";
import { useUserSession } from "./useUserSession";

const App: React.FC = () => {
  const { isLoading, isGuest, userProfile, error } = useUserSession({
    goToHomepage: () => {
      console.log(
        "Navigating to homepage - user authenticated with avatar/name"
      );
      // Navigate to homepage (e.g., using React Router)
      // window.location.href = '/homepage';
      // or navigate('/homepage') with React Router
    },
    showAvatarSelection: () => {
      console.log("Showing avatar selection - guest or incomplete profile");
      // Navigate to avatar selection page
      // window.location.href = '/avatar-selection';
      // or navigate('/avatar-selection') with React Router
    },
    serverUrl: process.env.REACT_APP_SERVER_URL || "http://localhost:3001",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading user session...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // This component will automatically navigate based on user status
  // The actual content won't be reached in normal flow since navigation happens in the hook
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <h1>SoulCircle</h1>
        <p>Status: {isGuest ? "Guest" : "Authenticated"}</p>
        {userProfile && !isGuest && (
          <div>
            <p>Name: {userProfile.user?.name}</p>
            <p>Avatar: {userProfile.user?.avatar}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
