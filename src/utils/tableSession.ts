import { SessionConfig } from "./sessionConfig";

/**
 * Table Session Storage
 *
 * Manages active table session data for Ghost Mode reconnection.
 * Uses SessionConfig to determine storage type (controlled by UI toggle):
 * - Tab mode (sessionStorage): Each tab gets independent session
 * - Global mode (localStorage): Session persists across tabs and browser restarts
 */

const STORAGE_KEY = "sc_tableSession";

export interface TableSession {
  userId: string;
  displayName: string;
  avatarId: string;
  roomId: string;
  tableId: string;
  joinedAt: number;
}

/**
 * Save table session to storage
 */
export function saveTableSession(session: TableSession): void {
  const storageType = SessionConfig.useTabSessions
    ? "sessionStorage"
    : "localStorage";
  const storage = SessionConfig.useTabSessions ? sessionStorage : localStorage;

  storage.setItem(STORAGE_KEY, JSON.stringify(session));
  console.log(`💾 [TableSession] Saved session (${storageType}):`, session);
}

/**
 * Get saved table session from storage
 * @returns TableSession or null if not exists
 */
export function getTableSession(): TableSession | null {
  const storageType = SessionConfig.useTabSessions
    ? "sessionStorage"
    : "localStorage";
  const storage = SessionConfig.useTabSessions ? sessionStorage : localStorage;

  const stored = storage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as TableSession;
    console.log(
      `📂 [TableSession] Retrieved session (${storageType}):`,
      session,
    );
    return session;
  } catch (e) {
    console.error(`❌ [TableSession] Failed to parse session:`, e);
    clearTableSession();
    return null;
  }
}

/**
 * Clear table session from storage
 * Called on explicit leave or session end
 */
export function clearTableSession(): void {
  const storage = SessionConfig.useTabSessions ? sessionStorage : localStorage;
  storage.removeItem(STORAGE_KEY);
}

export function hasActiveSession(): boolean {
  return getTableSession() !== null;
}
