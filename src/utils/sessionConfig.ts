// Global session configuration for testing
export const SessionConfig = {
  useTabSessions: false,

  getToken(): string | null {
    const token = this.useTabSessions
      ? sessionStorage.getItem("token")
      : localStorage.getItem("token");

    console.log("🔍 [SessionConfig] getToken():", {
      useTabSessions: this.useTabSessions,
      storageType: this.useTabSessions ? "sessionStorage" : "localStorage",
      token: token ? `${token.substring(0, 20)}...` : null,
      rawToken: token,
    });

    return token;
  },

  setToken(token: string): void {
    if (this.useTabSessions) {
      sessionStorage.setItem("token", token);
    } else {
      localStorage.setItem("token", token);
    }
  },

  removeToken(): void {
    if (this.useTabSessions) {
      sessionStorage.removeItem("token");
    } else {
      localStorage.removeItem("token");
    }
  },

  setMode(useTabSessions: boolean): void {
    this.useTabSessions = useTabSessions;
    console.log(
      `🔧 Session mode changed to: ${
        useTabSessions ? "Tab-specific" : "Shared across tabs"
      }`
    );
  },
};

// Make it globally accessible for debugging
(window as any).SessionConfig = SessionConfig;
