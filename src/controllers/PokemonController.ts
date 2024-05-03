import postgres from "postgres";
import Request from "../router/Request";
import Response, { StatusCode } from "../router/Response";
import Router from "../router/Router";

/**
 * Controller for handling Todo CRUD operations.
 * Routes are registered in the `registerRoutes` method.
 * Each method should be called when a request is made to the corresponding route.
 */
export default class Controller {
	private sql: postgres.Sql<any>;

	constructor(sql: postgres.Sql<any>) {
		this.sql = sql;
	}

	/**
	 * To register a route, call the corresponding method on
	 * the router instance based on the HTTP method of the route.
	 *
	 * @param router Router instance to register routes on.
	 *
	 * @example router.get("/todos", this.getTodoList);
	 */
	registerRoutes(router: Router) {
		// Any routes that include a `:id` parameter should be registered last.
		router.post("/box/:boxid/pokemon/:pokemonId/",this.addPokemon)
		router.get("/box/:boxId/pokemon/:pokemonId/",this.getPokemon)
		router.put("/box/:boxId/pokemon/:pokemonid/,",this.updatePokemon)
		router.delete("/box/:boxId/pokemon/:pokemonId/",this.removePokemonFromPC)
	}

	addPokemon = async (req: Request, res: Response) => {};

	getPokemon = async (req: Request, res: Response) => {};

	updatePokemon = async (req: Request, res: Response) => {};

	removePokemonFromPC = async (req: Request, res: Response) => {};
}
