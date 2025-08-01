import { useEffect, useState } from "react";

interface UserProfile {
  name?: string;
  avatarId?: string;
  isGuest: boolean;
  user: any;
}

interface UseUserSessionProps {
  goToHomepage: () => void;
  showAvatarSelection: () => void;
  serverUrl?: string;
}

interface UseUserSessionReturn {
  isLoading: boolean;
  isGuest: boolean;
  userProfile: UserProfile | null;
  error: string | null;
}

/**
 * Custom hook to manage user session and navigation flow
 *
 * 3 Scenarios:
 * 1. Guest user (no token) → Show avatar selection to "Join Table"
 * 2. New user (token but no avatar/name) → Show avatar selection to complete profile
 * 3. Returning user (token + avatar + name) → Go directly to homepage
 *
 * Note: Login/Signup ≠ Take a seat. After auth, we go to homepage, not directly to a table.
 */
export const useUserSession = ({
  goToHomepage,
  showAvatarSelection,
  serverUrl = "http://localhost:3001",
}: UseUserSessionProps): UseUserSessionReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get token from localStorage (if exists)
        const token = localStorage.getItem("authToken");

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Add Authorization header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${serverUrl}/api/auth/profile`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data: UserProfile = await response.json();
        setUserProfile(data);

        // Navigation logic based on the 3 scenarios
        if (data.isGuest) {
          // Scenario 1: Guest user - show avatar selection to "Join Table"
          console.log("Guest user detected - showing avatar selection");
          showAvatarSelection();
        } else if (data.name && data.avatarId) {
          // Scenario 3: Returning user with complete profile - go to homepage
          console.log(
            "Returning user with complete profile - going to homepage"
          );
          goToHomepage();
        } else {
          // Scenario 2: Authenticated user but incomplete profile - show avatar selection
          console.log(
            "Authenticated user with incomplete profile - showing avatar selection"
          );
          showAvatarSelection();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error checking user session:", err);

        // On error, treat as guest and show avatar selection
        showAvatarSelection();
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, [goToHomepage, showAvatarSelection, serverUrl]);

  return {
    isLoading,
    isGuest: userProfile?.isGuest ?? true,
    userProfile,
    error,
  };
};

export default useUserSession;
