import postgres from "postgres";
import Request from "../router/Request";
import Response, { StatusCode } from "../router/Response";
import Router from "../router/Router";
import Move,{PokemonSpecies,Box} from "../models/Database"
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
		router.get("/box/:boxId/pokemon/update/:pokemonId",this.getUpdatePokemonForm)
		router.get("/box/:boxId/pokemon",this.getPokemon)
		router.get("/box/:boxId/pokemon/:pokemonId", this.getPokemonDetails);
		router.put("/box/:boxId/pokemon/:pokemonId,",this.updatePokemon)
		router.delete("/box/:boxId/pokemon/:pokemonId",this.removePokemonFromPC)
	}

	getAddPokemonForm = async (req:Request,res:Response) =>{
		const moves = await Move.readAll(this.sql);
		const pokemon = await PokemonSpecies.readAll(this.sql);
		const params=req.getSearchParams();
		const session=req.getSession()
		const userId = session.get("userId")
		if(!userId){
			await res.send({
				statusCode: StatusCode.Unauthorized,
				message:"Unauthorized",
				payload:{loggedIn:false},
				redirect:"/login"
			});
		}
		else if(params.get("error")){
			await res.send({
				statusCode: StatusCode.OK,
				message:"New form",
				payload:{pokemon,moves,message:params.get("error"),loggedIn:true},
				template:"MakePokemonView"
			});
		}
		else{
			await res.send({
				statusCode: StatusCode.OK,
				message:"New form",
				payload:{pokemon,moves,loggedIn:true},
				template:"MakePokemonView"
			});
		}
		
	};
	getUpdatePokemonForm = async (req:Request,res:Response) =>{
		const session=req.getSession()
		const userId = session.get("userId")
		const moves = await Move.readAll(this.sql);
		const params=req.getSearchParams();
		const paths = req.getURL().pathname.split('/');
		const boxId = parseInt(paths[2], 10);
		const pokemonId = parseInt(paths[5], 10);

		if(!userId){
			await res.send({
				statusCode: StatusCode.Unauthorized,
				message:"Unauthorized",
				payload:{loggedIn:false},
				redirect:"/login"
			});
		}
		else if(params.get("error")){
			await res.send({
				statusCode: StatusCode.OK,
				message:"New form",
				payload:{moves,message:params.get("error"),boxId:boxId,pokemonId:pokemonId,loggedIn:true},
				template:"UpdatePokemonView"
			});
		}
		else{
			await res.send({
				statusCode: StatusCode.OK,
				message:"New form",
				payload:{moves,boxId:boxId,pokemonId:pokemonId,loggedIn:true},
				template:"UpdatePokemonView"
			});
		}
		
	};
	addPokemon = async (req: Request, res: Response) => {
		const session=req.getSession()
		let moveList:number[] = [req.body.move1,req.body.move2,req.body.move3,req.body.move4] 
		const userId = session.get("userId")
		req.body.userId = userId
		delete req.body.move1
		delete req.body.move2
		delete req.body.move3
		delete req.body.move4
		let sameMove = false;
		for(let i=0;i<moveList.length;i++){
			for(let j=0;j<moveList.length;j++){
				if(moveList[i]==moveList[j] && j!=i){
					sameMove=true;
				}
			}
		}
		if(!userId){
			await res.send({
				statusCode: StatusCode.Unauthorized,
				message:"Unauthorized",
				payload:{loggedIn:false},
				redirect:"/login"
			});
		}
		else if(sameMove){
			await res.send({
				statusCode:StatusCode.Created,
				message: "Pokemon has same move.",
				redirect: `/box/addpokemon?error=A Pokemon can't have the same move twice!`,
			});
		}
		else if(!req.body.level){
			await res.send({
				statusCode:StatusCode.Created,
				message: "Pokemon has same move.",
				redirect: `/box/addpokemon?error=A Pokemon needs a level!`,
			});
		}
		else if(!req.body.nature){
			await res.send({
				statusCode:StatusCode.Created,
				message: "Pokemon has same move.",
				redirect: `/box/addpokemon?error=A Pokemon needs a nature!`,
			});
		}
		else if(!req.body.ability){
			await res.send({
				statusCode:StatusCode.Created,
				message: "Pokemon has same move.",
				redirect: `/box/addpokemon?error=A Pokemon needs an ability!`,
			});
		}
		else{
			const boxes = await Box.getBoxes(this.sql,userId);
			req.body.boxId = boxes[0].props.id
			await Pokemon.create(this.sql,req.body as PokemonProps,moveList)
			await res.send({
			  statusCode:StatusCode.Created,
			  message: "Pokemon Created!",
			  redirect: `/box/${boxes[0].props.id}/pokemon`,
			  payload:{loggedIn:true},
		  });
		}
		
	};

	getPokemon = async (req: Request, res: Response) => {
		const boxId = parseInt(req.getURL().pathname.split('/')[2], 10);
		const params=req.getSearchParams();
		let message = params.get("message")
		if(!message){
			message= "Welcome To Your Box!"
		}
		if (isNaN(boxId)) {
			await res.send({
				statusCode: StatusCode.BadRequest,
				message: 'Invalid box ID'
			});
			return;
		}
		const session=req.getSession()
		const userId = session.get("userId")
		if(!userId){
			await res.send({
				statusCode: StatusCode.Unauthorized,
				message:"Unauthorized",
				payload:{loggedIn:false},
				redirect:"/login"
			});
			return;
		}
		try {
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
					box_species.box_id = ${boxId} AND
					box_species.user_id = ${userId} 
				ORDER BY
					box_species.id
				LIMIT 30;
				`;

	
			await connection.release();
	
			const boxes = await Box.getBoxes(this.sql,userId)
			await res.send({
				statusCode: StatusCode.OK,
				message: `Retrieved Pokémon for box ${boxId}`,
				payload: { pokemons, pokemon: null,message:message,loggedIn:true,boxes:boxes},
				template: "BoxView"
			});
		} catch (error) {
			await res.send({
				statusCode: StatusCode.InternalServerError,
				message: `Error retrieving Pokémon from box ${boxId}`,
				payload:{message:`Error retrieving Pokémon from box ${boxId}`,loggedIn:true}
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
		const session=req.getSession()
		const userId = session.get("userId")
		if(!userId){
			await res.send({
				statusCode: StatusCode.Unauthorized,
				message:"Unauthorized",
				payload:{loggedIn:false},
				redirect:"/login"
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
			const boxes = await Box.getBoxes(this.sql,userId)
			if (pokemon) {
				await res.send({
					statusCode: StatusCode.OK,
					message: `Retrieved Pokémon details for box ${boxId}, Pokémon ${pokemonId}`,
					payload: { pokemons, pokemon,boxId:boxId,pokemonId:pokemonId,loggedIn:true,boxes:boxes},
					template: "BoxView"
				});
			} else {
				await res.send({
					statusCode: StatusCode.NotFound,
					message: `No details found for Pokémon ${pokemonId} in box ${boxId}`,
					payload:{loggedIn:true}
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
	
	

	updatePokemon = async (req: Request, res: Response) => {
		const paths = req.getURL().pathname.split('/');
		const boxId = parseInt(paths[2], 10);
		const pokemonId = parseInt(paths[4], 10);
		const session=req.getSession()
		let moveList:number[] = [req.body.move1,req.body.move2,req.body.move3,req.body.move4] 
		req.body.userId = session.get("userId")
		delete req.body.move1
		delete req.body.move2
		delete req.body.move3
		delete req.body.move4
		delete req.body.method
		let sameMove = false;
		for(let i=0;i<moveList.length;i++){
			for(let j=0;j<moveList.length;j++){
				if(moveList[i]==moveList[j] && j!=i){
					sameMove=true;
				}
			}
		}
		const boxes = await Box.getBoxes(this.sql,req.body.userId)
		if(!req.body.userId){
			await res.send({
				statusCode: StatusCode.Unauthorized,
				message:"Unauthorized",
				payload:{loggedIn:false},
				redirect:"/login"
			});
		}
		else if(sameMove){
			await res.send({
				statusCode:StatusCode.Created,
				message: "Pokemon has same move.",
				redirect: `/box/${boxId}/pokemon/update/${pokemonId}?error=A Pokemon can't have the same move twice!`,
				payload:{loggedIn:true}
			});
		}
		else if(!req.body.level){
			await res.send({
				statusCode:StatusCode.Created,
				message: "Pokemon has same move.",
				redirect: `/box/${boxId}/pokemon/update/${pokemonId}error=A Pokemon needs a level!`,
				payload:{loggedIn:true}
			});
		}
		else if(!req.body.nature){
			await res.send({
				statusCode:StatusCode.Created,
				message: "Pokemon has same move.",
				redirect: `/box/${boxId}/pokemon/update/${pokemonId}error=A Pokemon needs a nature!`,
				payload:{loggedIn:true}
			});
		}
		else if(!req.body.ability){
			await res.send({
				statusCode:StatusCode.Created,
				message: "Pokemon has same move.",
				redirect: `/box/${boxId}/pokemon/update/${pokemonId}error=A Pokemon needs an ability!`,
				payload:{loggedIn:true,boxes:boxes}
			});
		}
		else{
			await Pokemon.update(this.sql,req.body as PokemonProps,pokemonId,moveList)
			await res.send({
			  statusCode:StatusCode.OK,
			  message: "Pokemon Updated!",
			  redirect: `/box/${boxId}/pokemon`,
			  payload:{loggedIn:true,boxes:boxes}
		  });
		}
	};

	removePokemonFromPC = async (req: Request, res: Response) => {
		const paths = req.getURL().pathname.split('/');
		const boxId = parseInt(paths[2], 10);
		const pokemonId = parseInt(paths[4], 10);
		let boxPokemon = await Pokemon.read(this.sql,pokemonId)
		const session=req.getSession()
		const userId = session.get("userId")
		if(!userId){
			await res.send({
				statusCode: StatusCode.Unauthorized,
				message:"Unauthorized",
				payload:{loggedIn:false},
				redirect:"/login"
			});
		}
		else if(!boxPokemon){
			await res.send({
				statusCode:StatusCode.OK,
				message: "Pokemon Deleted!",
				redirect: `/box/${boxId}/pokemon?message=Pokemon not found.`,
				payload:{loggedIn:true}
			});
		}
		else{
			let pokemon = await PokemonSpecies.read(this.sql,boxPokemon.props.pokemonId)
			await Pokemon.delete(this.sql,pokemonId)
			const boxes = await Box.getBoxes(this.sql,userId)
			await res.send({
				statusCode:StatusCode.OK,
				message: "Pokemon Deleted!",
				redirect: `/box/${boxId}/pokemon?message=Bye Bye ${pokemon.props.name}!`,
				payload:{loggedIn:true,boxes:boxes}
			});
		}
		
	};

}
