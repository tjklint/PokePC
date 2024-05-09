import postgres from "postgres";
import Request from "../router/Request";
import Response, { StatusCode } from "../router/Response";
import Router from "../router/Router";
import Pokemon from "../models/Pokemon";
import Team,{TeamPositionProps,TeamProps} from "../models/Team";
import { PokemonSpecies } from "../models/Database";
/**
 * Controller for handling Todo CRUD operations.
 * Routes are registered in the `registerRoutes` method.
 * Each method should be called when a request is made to the corresponding route.
 */
export default class TeamController {
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
		router.put("/team/:teamid/pokemon/swap",this.updateTeam)
        router.get("/team/:teamid/pokemon",this.getTeam)
        router.delete("/team/:teamid", this.deleteTeam)
        router.delete("/team/:teamid/pokemon/:pokemonId",this.deleteTeam)
	}
    updateTeam = async (req: Request, res: Response) => {
		const id = req.getId();
		await Team.insert(this.sql,id,req.body.boxSpeciesId,req.body.position)
		await res.send({
			statusCode: StatusCode.OK,
			message:"New form",
			redirect:`/team/${id}/pokemon`
		});
	};

    getTeam = async (req: Request, res: Response) => {
		const id = req.getId();
		let pokemon = await Team.read(this.sql);
		let teamPokemon:PokemonSpecies[] = []
		for (let i=0;i<pokemon.length;i++){
			teamPokemon[i] = await PokemonSpecies.read(this.sql,pokemon[i].props.pokemonId)
		}
		let allPokemon = await Pokemon.readAll(this.sql);
		let boxPokemon:PokemonSpecies[] = [] 
		for (let i=0;i<allPokemon.length;i++){
			boxPokemon[i] = await PokemonSpecies.read(this.sql,allPokemon[i].props.pokemonId)
		}
		await res.send({
			statusCode: StatusCode.OK,
			message:"New form",
			payload:{teamPokemon,boxPokemon,id},
			template:"TeamView"
		});
	};

    deleteTeam = async (req: Request, res: Response) => {};

}