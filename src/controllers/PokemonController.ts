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
		router.get("/box/:boxId/pokemon",this.getPokemon)
		router.get("/box/:boxId/pokemon/:pokemonId", this.getPokemonDetails);
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
		const session=req.getSession()
		let moveList:Move[] = [req.body.move1,req.body.move2,req.body.move3,req.body.move4] 
		req.body.userId = session.get("userId")
		delete req.body.move1
		delete req.body.move2
		delete req.body.move3
		delete req.body.move4
		Pokemon.create(this.sql,req.body as PokemonProps,moveList)
				await res.send({
				  statusCode:StatusCode.Created,
				  message: "Pokemon Created!",
				  redirect: `/box/1/pokemon`,
			  });
	};

	getPokemon = async (req: Request, res: Response) => {
		const boxId = parseInt(req.getURL().pathname.split('/')[2], 10);
	
		if (isNaN(boxId)) {
			await res.send({
				statusCode: StatusCode.BadRequest,
				message: 'Invalid box ID'
			});
			return;
		}
	
		try {
			// Reserve a database connection
			const connection = await this.sql.reserve();
	
			const pokemons = await connection<PokemonProps[]>`
				SELECT
					box_species.id,
					box_species.level,
					box_species.nature,
					box_species.ability,
					box_species.box_id AS "boxId", 
					pokemon_species.name,
					pokemon_species.type,
					pokemon_species.userImageURL
				FROM
					box_species
				JOIN
					pokemon_species ON box_species.pokemon_id = pokemon_species.id
				WHERE
					box_species.box_id = ${boxId}
				ORDER BY
					box_species.id
				LIMIT 30;
				`;

	
			await connection.release();
	
			// Pass the Pokémon grid with a default empty `pokemon` object
			await res.send({
				statusCode: StatusCode.OK,
				message: `Retrieved Pokémon for box ${boxId}`,
				payload: { pokemons, pokemon: null },
				template: "BoxView"
			});
		} catch (error) {
			await res.send({
				statusCode: StatusCode.InternalServerError,
				message: `Error retrieving Pokémon from box ${boxId}`
			});
		}
	};
	
	
	getPokemonDetails = async (req: Request, res: Response) => {
		const paths = req.getURL().pathname.split('/');
		const boxId = parseInt(paths[2], 10);
		const pokemonId = parseInt(paths[4], 10);

		console.log(boxId);
	
		if (isNaN(boxId) || isNaN(pokemonId)) {
			await res.send({
				statusCode: StatusCode.BadRequest,
				message: 'Invalid box or Pokémon ID'
			});
			return;
		}
	
		try {
			const connection = await this.sql.reserve();
	
			const [pokemon] = await connection<PokemonProps[]>`
				SELECT
					box_species.id,
					box_species.level,
					box_species.nature,
					box_species.ability,
					box_species.box_id AS "boxId", 
					pokemon_species.name,
					pokemon_species.type,
					pokemon_species.userImageURL,
					ARRAY_AGG(moves.name) as moves
				FROM
					box_species
				JOIN
					pokemon_species ON box_species.pokemon_id = pokemon_species.id
				LEFT JOIN
					pokemon_moves ON box_species.id = pokemon_moves.box_species_id
				LEFT JOIN
					moves ON pokemon_moves.move_id = moves.id
				WHERE
					box_species.id = ${pokemonId}
				GROUP BY
					box_species.id, pokemon_species.id
			`;
	
			const pokemons = await connection<PokemonProps[]>`
				SELECT
					box_species.id,
					box_species.level,
					box_species.nature,
					box_species.ability,
					box_species.box_id AS "boxId", 
					pokemon_species.name,
					pokemon_species.type,
					pokemon_species.userImageURL
				FROM
					box_species
				JOIN
					pokemon_species ON box_species.pokemon_id = pokemon_species.id
				WHERE
					box_species.box_id = ${boxId}
				ORDER BY
					box_species.id
				LIMIT 30;
			`;

		
	
			await connection.release();
	
			if (pokemon) {
				await res.send({
					statusCode: StatusCode.OK,
					message: `Retrieved Pokémon details for box ${boxId}, Pokémon ${pokemonId}`,
					payload: { pokemons, pokemon },
					template: "BoxView"
				});
			} else {
				await res.send({
					statusCode: StatusCode.NotFound,
					message: `No details found for Pokémon ${pokemonId} in box ${boxId}`
				});
			}
		} catch (error) {
			console.error(`Error while retrieving Pokémon details for box ${boxId}, Pokémon ${pokemonId}:`, error);
			await res.send({
				statusCode: StatusCode.InternalServerError,
				message: `Error retrieving Pokémon details for box ${boxId}, Pokémon ${pokemonId}`
			});
		}
	};
	
	

	updatePokemon = async (req: Request, res: Response) => {};

	removePokemonFromPC = async (req: Request, res: Response) => {};
}
