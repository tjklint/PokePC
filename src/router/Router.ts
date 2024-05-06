import Request from "./Request";
import Response from "./Response";

interface RouteHandler {
	(req: Request, res: Response): void;
}

interface Routes {
	[method: string]: {
		[path: string]: RouteHandler;
	};
}

/**
 * A class that represents a simple router. It is used to register
 * routes and find the appropriate handler for a given request.
 * @template T The type of the request body.
 */
export default class Router {
	routes: Routes;

	constructor(routes?: Routes) {
		this.routes = routes || {
			GET: {},
			POST: {},
			PUT: {},
			DELETE: {},
		};
	}

	/**
	 * Given an HTTP method and a path, this method returns the
	 * handler that matches the method and path. If no matching
	 * handler is found, it returns `undefined`.
	 * @param method The HTTP method of the request.
	 * @param path The path of the request.
	 * @returns The matching handler or `undefined` if no match is found.
	 */
	findMatchingHandler = (
		method: string,
		path: string,
	): RouteHandler | undefined => {
		const methodRoutes = this.routes[method]; // Get routes for the HTTP method.

		if (!methodRoutes) return undefined; // Not a supported method.

		// Iterate through defined routes of the current method.
		for (const routePattern in methodRoutes) {
			if (this.doesPathMatchPattern(path, routePattern)) {
				return methodRoutes[routePattern]; // Found a match!
			}
		}

		return undefined; // No matching handler was found.
	};

	/**
	 * Checks if a given path matches a given route pattern.
	 * @param path The path to check from the request.
	 * @param routePattern The route pattern to match against.
	 * @returns Whether the path matches the pattern.
	 * @example doesPathMatchPattern("/todos/1", "/todos/:id") => true
	 * @example doesPathMatchPattern("/todos/1", "/todos") => false
	 */
	private doesPathMatchPattern = (
		path: string,
		routePattern: string,
	): boolean => {
		const pathSegments = this.removeQueryString(path).split("/");
		const patternSegments = routePattern.split("/");

		// Basic check: Do they even have the same number of segments?
		if (pathSegments.length !== patternSegments.length) return false;

		// Segment-by-segment comparison. We'll check each segment of the path
		// against the corresponding segment of the pattern. If we find a mismatch,
		// we'll return false. If we make it through the entire path and pattern
		// without finding a mismatch, we'll return true.
		for (let i = 0; i < pathSegments.length; i++) {
			// Dynamic segment (starts with ':' in your pattern).
			if (patternSegments[i].startsWith(":")) continue; // These always match.

			// If not an exact match, it's no good.
			if (patternSegments[i] !== pathSegments[i]) return false;
		}

		return true; // We've successfully matched all segments!
	};

	/**
	 * Strips the query string from a given path.
	 * @param path The path to remove the query string from.
	 * @returns The path without the query string.
	 * @example removeQueryString("/todos/1?completed=true") => "/todos/1"
	 */
	private removeQueryString = (path: string): string => {
		const parts = path.split("?");
		return parts[0];
	};

	get(path: string, handler: RouteHandler) {
		this.routes.GET[path] = handler;
	}

	post(path: string, handler: RouteHandler) {
		this.routes.POST[path] = handler;
	}

	put(path: string, handler: RouteHandler) {
		this.routes.PUT[path] = handler;
	}

	delete(path: string, handler: RouteHandler) {
		this.routes.DELETE[path] = handler;
	}
}
