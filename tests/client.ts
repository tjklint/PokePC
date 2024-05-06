import http, { IncomingMessage } from "http";

export interface HttpResponse {
	statusCode: number | undefined;
	body: any;
	cookies?: Record<string, string>;
}

let cookieJar: Record<string, string> = {};

export const makeHttpRequest = async (
	method: string,
	path: string,
	data = {},
	accept = "application/json",
): Promise<HttpResponse> => {
	const options = {
		host: "localhost",
		port: 3000,
		path,
		method,
		headers: {
			"Content-Type": "application/json",
			Accept: accept,
			"Content-Length": Buffer.byteLength(JSON.stringify(data)),
			Cookie: getCookieJar(),
		},
	};

	return new Promise((resolve, reject) => {
		let body = "";
		const request = http.request(options, (response) => {
			response.on("data", (chunk) => {
				body += chunk;
			});
			response.on("end", () =>
				resolve({
					statusCode: response.statusCode,
					body: JSON.parse(body),
					cookies: setCookieJar(response),
				}),
			);
		});

		request.on("error", (err) => reject(err));
		request.write(JSON.stringify(data));
		request.end();
	});
};

const getCookie = (name: string) => {
	return cookieJar[name] ?? null;
};

const getCookieJar = () => {
	return JSON.stringify(cookieJar)
		.slice(1, -1)
		.replace(/,/g, "; ")
		.replace(/:/g, "=")
		.replace(/["]/g, "");
};

const setCookieJar = (response: IncomingMessage) => {
	cookieJar = response.headers["set-cookie"]
		? response.headers["set-cookie"].reduce((accumulator, cookie) => {
				const [key, value] = cookie.split("=");
				[accumulator[key]] = value.split(";");
				return accumulator;
			}, cookieJar)
		: cookieJar;

	return cookieJar;
};

export const clearCookieJar = () => {
	cookieJar = {};
};
