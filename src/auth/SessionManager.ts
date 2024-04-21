import crypto from "crypto";
import Session from "./Session";

/**
 * The SessionManager class is a singleton that manages all sessions
 * by creating new sessions and removing expired sessions.
 */
export default class SessionManager {
	private static instance: SessionManager;
	sessions: Session[];
	cleanUp: NodeJS.Timeout;

	private constructor() {
		this.sessions = [];

		// Run clean up every second.
		this.cleanUp = setInterval(this.cleanUpSessions, 1000);
	}

	/**
	 * Like the View.ts class, the SessionManager class is a singleton.
	 * If no instance of the SessionManager exists, a new instance is created.
	 * @returns The singleton instance of the SessionManager.
	 */
	static getInstance = (): SessionManager => {
		if (!SessionManager.instance) {
			SessionManager.instance = new SessionManager();
		}

		return SessionManager.instance;
	};

	/**
	 * Creates a new session and adds it to the sessions array.
	 * The session ID is a random 4-character hex string.
	 * @returns A new session.
	 */
	createSession() {
		const sessionId = crypto.randomBytes(2).toString("hex");
		const session = new Session(sessionId);

		this.sessions.push(session);

		return session;
	}

	/**
	 * Searches for a session with the given sessionId.
	 * Uses linear search to find the session which
	 * isn't the most efficient way to find something,
	 * but it's good enough for this assignment.
	 * @returns The session with the given sessionId.
	 */
	get(sessionId: string) {
		return this.sessions.find((session) => session.id === sessionId);
	}

	/**
	 * Removes all expired sessions from the sessions array.
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	 */
	cleanUpSessions() {
		this.sessions = this.sessions?.filter(
			(session) => !session.isExpired(),
		);
	}

	stopCleanUp() {
		process.nextTick(clearInterval, this.cleanUp);
	}
}
