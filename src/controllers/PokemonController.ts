import postgres from "postgres";
import Request from "../router/Request";
import Response, { StatusCode } from "../router/Response";
import Router from "../router/Router";
import Move,{PokemonSpecies} from "../models/Database"
import Pokemon,{PokemonProps} from "../models/Pokemon";
/**
 * Controller for handling Todo CRUD operations.
 * Routes are registered in the `registerRoutes` method.
 * Each method should be called when a request is made to the corresponding route.
 */
export default class PokemonController {
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
		router.get("/box/addpokemon",this.getAddPokemonForm)
		router.get("/box/:boxId/pokemon/:pokemonId/",this.getPokemon)
		router.put("/box/:boxId/pokemon/:pokemonid/,",this.updatePokemon)
		router.delete("/box/:boxId/pokemon/:pokemonId/",this.removePokemonFromPC)
	}

	getAddPokemonForm = async (req:Request,res:Response) =>{
		const moves = await Move.readAll(this.sql);
		const pokemon = await PokemonSpecies.readAll(this.sql);
		await res.send({
			statusCode: StatusCode.OK,
			message:"New form",
			payload:{pokemon,moves},
			template:"MakePokemonView"
		});
	};
	addPokemon = async (req: Request, res: Response) => {
		Pokemon.create(this.sql,req.body as PokemonProps)
				await res.send({
				  statusCode:StatusCode.Created,
				  message: "Pokemon Created!",
				  redirect: `/login`,
			  });
	};

	getPokemon = async (req: Request, res: Response) => {};

	updatePokemon = async (req: Request, res: Response) => {};

	removePokemonFromPC = async (req: Request, res: Response) => {};
}
