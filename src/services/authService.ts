// Auth Service for SoulCircle
import { SessionConfig } from "../utils/sessionConfig";
import { SOCKET_SERVER_URL } from "../config";

const API_BASE_URL = process.env.REACT_APP_SERVER_URL || SOCKET_SERVER_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Initialize from SessionConfig on service creation
    this.token = SessionConfig.getToken();
    console.log(
      "🔧 [AuthService] Constructor - Token from SessionConfig:",
      this.token
    );

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
        console.log(
          "👤 [AuthService] Constructor - User from localStorage:",
          this.user
        );
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem("user");
      }
    }
  }

  // Register new user
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Store token and user
    this.token = data.token;
    this.user = data.user;
    SessionConfig.setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  }

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store token and user
    this.token = data.token;
    this.user = data.user;
    SessionConfig.setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  }

  // Logout user
  logout(): void {
    this.token = null;
    this.user = null;
    SessionConfig.removeToken();
    localStorage.removeItem("user");
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.user;
  }

  // Get token
  getToken(): string | null {
    return this.token;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get user profile
  async getProfile(): Promise<User> {
    if (!this.token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        this.logout(); // Token is invalid
      }
      throw new Error(data.message || "Failed to get profile");
    }

    this.user = data.user;
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  }

  // Update user profile
  async updateProfile(
    updates: Partial<Pick<User, "name" | "avatar">>
  ): Promise<User> {
    if (!this.token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        this.logout(); // Token is invalid
      }
      throw new Error(data.message || "Failed to update profile");
    }

    this.user = data.user;
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  }

  // Handle Google OAuth callback
  handleGoogleCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userStr = urlParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        this.token = token;
        this.user = user;
        SessionConfig.setToken(token);
        localStorage.setItem("user", JSON.stringify(user));

        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (e) {
        console.error("Failed to parse Google OAuth callback:", e);
      }
    }
  }

  // Initialize Google OAuth
  loginWithGoogle(): void {
    window.open(`${API_BASE_URL}/api/auth/google`, "_self");
  }
}

// Export singleton instance
export const authService = new AuthService();
