import Cookie from "./Cookie";

export default class Session {
	id: string;
	data: Record<string, any>;
	cookie: Cookie;

	constructor(id: string, data = {}) {
		this.id = id;
		this.data = data;
		this.cookie = new Cookie("session_id", id);
	}

	get(name: string) {
		return this.data[name] ?? null;
	}

	set(name: string, value: any) {
		this.data[name] = value;
	}

	exists(name: string) {
		return this.get(name) !== null;
	}

	refresh(time = Cookie.DEFAULT_TIME) {
		this.cookie.setExpires(time);
	}

	destroy() {
		this.data = {};
		this.cookie.setExpires();
	}

	isExpired() {
		return this.cookie.getExpires() <= Date.now();
	}
}
