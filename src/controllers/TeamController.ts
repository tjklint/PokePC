import postgres from "postgres";
import Request from "../router/Request";
import Response, { StatusCode } from "../router/Response";
import Router from "../router/Router";
import Pokemon from "../models/Pokemon";
import Team,{TeamPositionProps,TeamProps} from "../models/Team";
import { PokemonSpecies } from "../models/Database";
import User,{UserProps} from "../models/User";
/**
 * Controller for handling Todo CRUD operations.
 * Routes are registered in the `registerRoutes` method.
 * Each method should be called when a request is made to the corresponding route.
 */
interface UserTeamProps{
	teamId:number | undefined;
	email:string;
	teamName:string;
}
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
		router.get("/team",this.getAllTeams)
        router.delete("/team/:teamid", this.deleteTeam)
        router.delete("/team/:teamid/pokemon/:pokemonId",this.deleteTeam)
	}
    updateTeam = async (req: Request, res: Response) => {
		const id = req.getId();
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
		else{
			try{
				await Team.insert(this.sql,id,req.body.boxSpeciesId,req.body.position)
				await res.send({
					statusCode: StatusCode.OK,
					message:"New form",
					redirect:`/team/${id}/pokemon`
				});
			}
			catch{
				await res.send({
					statusCode: StatusCode.OK,
					message:"New form",
					redirect:`/team/${id}/pokemon?error=Pokemon is already in that position!`
				});
			}
			
		}
		
	};

	getAllTeams = async (req:Request,res:Response) =>{
		const teams = await Team.readAll(this.sql);
		const session=req.getSession()
		const userId=session.get("userId")
		let loggedIn = false;
		if(userId){
			loggedIn=true;
		}
		let user;
		let newTeams:UserTeamProps[] =[];
		for(let i=0;i<teams.length;i++){
			if(teams[i].props.name == "Team1"){
				user = await User.read(this.sql,teams[i].props.userId)
			}
			if(user?.props.email){
				newTeams[i] = {
					teamId:teams[i].props.id,
					teamName:teams[i].props.name,
					email:user.props.email
				} 
			}
			
		}
		await res.send({
			statusCode: StatusCode.OK,
			message:"All Teams Retrieved!",
			template:"ListTeams",
			payload:{teams:newTeams,loggedIn:loggedIn}
		});
	}
    getTeam = async (req: Request, res: Response) => {
		const id = req.getId();
		let team = await Team.readTeam(this.sql,id);
		const session=req.getSession()
		const userId=session.get("userId")
		let isUser=false;
		const params=req.getSearchParams();
		let message = params.get("error")
		if(!message){
			message=""
		}
		if(team.props.userId == userId){
			isUser=true;
		}
		if(!userId){
			await res.send({
				statusCode: StatusCode.Unauthorized,
				message:"Unauthorized",
				payload:{loggedIn:false},
				redirect:"/login"
			});
			return;
		}
		
		let pokemon = await Team.read(this.sql,id);
		let count:number[]= []
		let hasCount = true
		if(!pokemon){
			hasCount = false
		}
		else{
			for(let i=0;i<pokemon.length+1;i++){
				if(i+1!=7){
					count[i] = i+1
				}
				
			}
		}
		let teamPokemon:PokemonSpecies[] = []
		for (let i=0;i<pokemon.length;i++){
			teamPokemon[i] = await PokemonSpecies.read(this.sql,pokemon[i].props.pokemonId)
		}
		let allPokemon = await Pokemon.readAll(this.sql,userId);
		let boxPokemon:PokemonSpecies[] = [] 
		for (let i=0;i<allPokemon.length;i++){
			boxPokemon[i] = await PokemonSpecies.read(this.sql,allPokemon[i].props.pokemonId)
			boxPokemon[i].props.id = allPokemon[i].props.id
		}
		const teams = await Team.readAllTeamsForUser(this.sql,userId)
		await res.send({
			statusCode: StatusCode.OK,
			message:"Team Pokemon Retrieved!",
			payload:{teamPokemon,boxPokemon,id,isUser,loggedIn:true,message:message,teams:teams,count:count,hasCount},
			template:"TeamView"
		});
	};

    deleteTeam = async (req: Request, res: Response) => {};

}