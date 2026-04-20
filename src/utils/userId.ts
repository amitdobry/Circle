import { SessionConfig } from "./sessionConfig";

/**
 * User Identity Management
 *
 * Manages stable userId for Ghost Mode reconnection.
 * Uses SessionConfig to determine storage type (controlled by UI toggle):
 * - Tab mode (sessionStorage): Each tab gets independent userId
 * - Global mode (localStorage): userId persists across tabs and browser restarts
 */

const STORAGE_KEY = "sc_userId";

/**
 * Get or create a stable userId for this user
 * @returns UUID string stored in sessionStorage or localStorage based on SessionConfig
 */
export function getOrCreateUserId(): string {
  const storageType = SessionConfig.useTabSessions
    ? "sessionStorage"
    : "localStorage";
  const storage = SessionConfig.useTabSessions ? sessionStorage : localStorage;

  const existing = storage.getItem(STORAGE_KEY);
  if (existing) {
    console.log(
      `👤 [UserId] Retrieved existing userId: ${existing} (${storageType})`,
    );
    return existing;
  }

  // Generate new UUID
  const id = crypto.randomUUID();
  storage.setItem(STORAGE_KEY, id);
  console.log(`🆕 [UserId] Created new userId: ${id} (${storageType})`);

  return id;
}

/**
 * Get the current userId without creating a new one
 * @returns userId or null if not exists
 */
export function getUserId(): string | null {
  const storage = SessionConfig.useTabSessions ? sessionStorage : localStorage;
  return storage.getItem(STORAGE_KEY);
}

/**
 * Clear the userId (for testing or explicit logout)
 */
export function clearUserId(): void {
  const storage = SessionConfig.useTabSessions ? sessionStorage : localStorage;
  storage.removeItem(STORAGE_KEY);
}
