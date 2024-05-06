import { ServerResponse } from "http";
import View from "../views/View";
import Request from "./Request";
import Cookie from "../auth/Cookie";

export enum StatusCode {
	OK = 200,
	Created = 201,
	NoContent = 204,
	Redirect = 302,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	InternalServerError = 500,
}

export enum ContentType {
	JSON = "application/json",
	HTML = "text/html",
}

export interface ResponseProps {
	statusCode: StatusCode;
	message: string;
	payload?: any;
	template?: string;
	redirect?: string;
}

/**
 * A class that wraps the `ServerResponse` object and provides
 * a method for sending JSON responses. This class is used by
 * the Router to send responses to the client. It is also used
 * by the controllers to send responses to the client.
 */
export default class Response {
	constructor(
		public req: Request,
		public res: ServerResponse,
		public cookies: Cookie[] = [],
	) {}

	/**
	 * Sends a JSON response to the client. The response is
	 * formatted as an object with a `message` property and a
	 * `payload` property. The `message` property is a string
	 * that describes the response. The `payload` property is
	 * an object that contains the data to be sent to the client.
	 */
	public send = async (props: ResponseProps) => {
		const { statusCode, message, payload, redirect, template } = props;

		console.log(
			`<<< ${statusCode} ${message} ${payload ? JSON.stringify(payload, null, 2) : ""}`,
		);

		if (this.req.accepts(ContentType.HTML)) {
			// If a redirect URL is provided, send a 302 status code and the redirect URL.
			if (redirect) {
				this.res.statusCode = StatusCode.Redirect;
				this.res.setHeader("Location", redirect);
				this.res.end();
				return;
			}

			// If a template is provided and the client accepts HTML, render the template.
			if (template) {
				this.res.statusCode = statusCode;
				this.res.setHeader("Content-Type", ContentType.HTML);
				this.res.end(await View.render(template, payload));
				return;
			}
		}

		// Otherwise, send a JSON response.
		this.res.statusCode = statusCode;
		this.res.setHeader("Content-Type", ContentType.JSON);
		this.res.end(JSON.stringify({ message, payload }, null, 2));
	};

	/**
	 * Sets a cookie in the response.
	 * Every time this method is called, the `Set-Cookie` header
	 * is updated with the new cookie (and all cookies that were
	 * added before it, if any), and the new cookie is added to the
	 * `cookies` array.
	 */
	public setCookie(cookie: Cookie) {
		this.cookies.push(cookie);
		this.res.setHeader("Set-Cookie", this.stringifyCookies());
	}

	/**
	 * Converts the `cookies` array to a string that can be used
	 * in the `Set-Cookie` header. This method is called every time
	 * a cookie is added to the `cookies` array.
	 */
	private stringifyCookies() {
		return this.cookies.map((cookie) => cookie.toString());
	}
}
