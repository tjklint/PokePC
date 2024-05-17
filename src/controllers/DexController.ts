import postgres from "postgres";
import Router from "../router/Router";
import Request from "../router/Request";
import Response from "../router/Response";
import { StatusCode } from "../router/Response";
import User, { UserProps } from "../models/User";
import Cookie from "../auth/Cookie";
import { rmSync } from "fs";
import {PokemonSpecies} from "../models/Database"

export default class DexController {
	private sql: postgres.Sql<any>;

	constructor(sql: postgres.Sql<any>) {
		this.sql = sql;
	}
    registerRoutes(router: Router) {
		// Any routes that include a `:id` parameter should be registered last.
		router.get("/dex/pokemon",this.getDexPokemonForm)
        router.get("/dex/pokemon/:pokemonId",this.getDexPokemonDetails)
	}
    getDexPokemonForm = async (req:Request,res:Response) =>{
        const session=req.getSession()
		const userId = session.get("userId")
        let loggedIn = false;
		if(userId){
			loggedIn=true
		}
		const pokemon = await PokemonSpecies.readAll(this.sql);
			await res.send({
				statusCode: StatusCode.OK,
				message:"Dex Pokemon Were Retrieved!",
				payload:{pokemon:pokemon,loggedIn:loggedIn},
				template:"DexView"
			});
	};
    getDexPokemonDetails = async (req:Request,res:Response) =>{
        const params=req.getSearchParams();
		const paths = req.getURL().pathname.split('/');
		const pokemonId = parseInt(paths[3], 10);
		const pokemon = await PokemonSpecies.read(this.sql,pokemonId);
        const session=req.getSession()
		const userId = session.get("userId")
        let loggedIn = false;
		if(userId){
			loggedIn=true
		}
			await res.send({
				statusCode: StatusCode.OK,
				message:"Dex Pokemon Retrieved!",
				payload:{pokemon,loggedIn:loggedIn},
				template:"DexPokemonView"
			});
	};
}