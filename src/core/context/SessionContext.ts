// FileName: src/core/context/SessionContext.ts
/**
 * Manages the session context, including saving to and loading from localStorage.
 */
import { SessionContext } from './types';

const LOCAL_STORAGE_KEY_PREFIX = 'hybridSession_';
const CURRENT_SESSION_VERSION = '1.0.0';

/**
 * Saves the current session context to localStorage.
 * @param {SessionContext} context The session context to save.
 */
export function saveSession(context: SessionContext): void {
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage is not available. Session will not be persisted.');
    return;
  }
  try {
    // Update timestamp before saving
    context.lastUpdatedAt = new Date().toISOString();
    const serializedContext = JSON.stringify(context);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${context.sessionId || 'default'}`, serializedContext);
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
}

/**
 * Loads a session context from localStorage.
 * @param {string} sessionId The ID of the session to load. Defaults to 'default'.
 * @returns {SessionContext | null} The loaded session context, or null if not found or invalid.
 */
export function loadSession(sessionId: string = 'default'): SessionContext | null {
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage is not available. Cannot load session.');
    return null;
  }
  try {
    const serializedContext = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${sessionId}`);
    if (!serializedContext) {
      return null;
    }
    const parsedContext = JSON.parse(serializedContext);
    if (parsedContext.version !== CURRENT_SESSION_VERSION) {
      console.warn(
        `Session version mismatch. Found ${parsedContext.version}, expected ${CURRENT_SESSION_VERSION}. Attempting migration or discarding.`,
      );
      const migratedContext = migrateSession(parsedContext);
      if (!migratedContext) {
        console.warn('Migration failed or not implemented. Discarding old session.');
        localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${sessionId}`);
        return null;
      }
      saveSession(migratedContext);
      return migratedContext;
    }
    return parsedContext as SessionContext;
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
    return null;
  }
}

/**
 * Placeholder for migrating session data from an older version to the current version.
 * @param {any} oldContextData The session data from an older version.
 * @returns {SessionContext | null} The migrated session context, or null if migration is not possible.
 */
export function migrateSession(oldContextData: any): SessionContext | null {
  console.log('Attempting to migrate session from version:', oldContextData.version);
  return null;
}

/**
 * Creates a new, empty session context.
 * @param {string} sessionId A unique ID for the new session.
 * @returns {SessionContext} A new SessionContext object.
 */
export function createNewSession(sessionId: string): SessionContext {
    return {
        sessionId,
        version: CURRENT_SESSION_VERSION,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        initialInput: null,
        stepOutputs: {},
        executionHistory: [],
    };
}
