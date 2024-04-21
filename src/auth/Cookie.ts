export default class Cookie {
	static DEFAULT_TIME: number = 1000 * 60 * 10; // Milliseconds * seconds * minutes.

	name: string;
	value: string;
	expires: Date;
	httpOnly: boolean;

	constructor(
		name: string,
		value: string,
		expires = Cookie.DEFAULT_TIME,
		httpOnly = true,
	) {
		this.name = name;
		this.value = value;
		this.httpOnly = httpOnly;
		this.expires = new Date(Date.now() + expires);
	}

	getExpires() {
		return this.expires.getTime();
	}

	/**
	 * Sets the expiration date of the cookie.
	 * @param {number} time The number of milliseconds from now that the cookie should expire.
	 */
	setExpires(time = 0) {
		this.expires = new Date(Date.now() + time);
	}

	/**
	 * Generates the valid string representation of the cookie to be sent in a response header.
	 * @returns The string representation of the cookie.
	 */
	toString() {
		return `${this.name}=${
			this.value
		}; Path=/; HttpOnly; SameSite=Strict; Expires=${this.expires.toUTCString()}`;
	}
}
