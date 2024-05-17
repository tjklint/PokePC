import postgres from "postgres";
import {
	camelToSnake,
	convertToCase,
	createUTCDate,
	snakeToCamel,
} from "../utils";
import Pokemon from "./Pokemon"
import { Exception } from "handlebars";
export interface TeamProps {
	id?: number;
	userId:number;
	name:string;
}
export interface TeamPositionProps {
	teamId: number;
	boxSpeciesId:number;
	position:number;
}
class PokemonNotFound extends Error {
	constructor() {
		super("Pokemon not found.");
	}
}
export class SamePositionSamePokemon extends Error {
	constructor() {
		super("Pokemon is already in this slot.");
	}
}
export default class Team {
	constructor(
		private sql: postgres.Sql<any>,
		public props: TeamProps,
	) {}

	static async create(sql: postgres.Sql<any>, props: TeamProps): Promise<Team> {
		const connection = await sql.reserve();

		const [row] = await connection<TeamProps[]>`
			INSERT INTO team
				${sql(convertToCase(camelToSnake, props))}
			RETURNING *
		`;

		await connection.release();

		return new Team(sql, convertToCase(snakeToCamel, row) as TeamProps);
	}
	static async insert(sql: postgres.Sql<any>, teamId:number,pokemonId:number,position:number){
		const connection = await sql.reserve();

		const checkPokemon = await this.readOne(sql,teamId,position)
		
		if(checkPokemon){
			if(checkPokemon.boxSpeciesId == pokemonId){
				throw new SamePositionSamePokemon
			}
			this.update(sql,teamId,pokemonId,position)
		}
		else{
			const pokemon = await connection<TeamPositionProps[]>`
			SELECT * FROM
			team_positions 
			WHERE box_species_id = ${pokemonId}
		`;
		if(pokemon){
			await this.deleteTeamPokemon(sql,pokemonId)
		}
			const [row] = await connection<TeamProps[]>`
			INSERT INTO team_positions
				(team_id,box_species_id,position) VALUES(${teamId},${pokemonId},${position})
			RETURNING *
		`;
		}
		

		await connection.release();

	}
	static async readOne(sql: postgres.Sql<any>, teamId:number,position:number){
		const connection = await sql.reserve();

		const [row] = await connection<TeamPositionProps[]>`
			SELECT * FROM
			team_positions 
			WHERE team_id = ${teamId} AND position = ${position}
		`;

		await connection.release();

		if (!row){
			return null;
		}
		return convertToCase(snakeToCamel, row) as TeamPositionProps
	}
	static async read(sql: postgres.Sql<any>,teamId:number): Promise<Pokemon[]> {
		const connection = await sql.reserve();
		//userId will need to be implemented later, can only access their pokemon.
		const rows = await connection<TeamPositionProps[]>`
			SELECT *
			FROM team_positions
			WHERE team_id=${teamId}
		`;

		await connection.release();
		let teamPositions:TeamPositionProps[] = rows.map(
			(row) =>
				 convertToCase(snakeToCamel, row) as TeamPositionProps,
		);
		let pokemonList:Pokemon[] = []
		for (let i=0;i<rows.length;i++){
			let pokemon = await Pokemon.read(sql,teamPositions[i].boxSpeciesId)
			if(!pokemon){
				throw new PokemonNotFound
			}
			pokemonList[i] = pokemon
		}
		return pokemonList
	}
	static async readTeam(sql: postgres.Sql<any>,id:number): Promise<Team> {
		const connection = await sql.reserve();
		//userId will need to be implemented later, can only access their pokemon.
		const [row] = await connection<TeamProps[]>`
			SELECT *
			FROM team
			WHERE id=${id}
		`;

		await connection.release();

		return new Team(sql, convertToCase(snakeToCamel, row) as TeamProps)
	}

	static async readAll(sql: postgres.Sql<any>): Promise<Team[]> {
		const connection = await sql.reserve();
		//userId will need to be implemented later, can only access their pokemon.
		const rows = await connection<TeamProps[]>`
			SELECT *
			FROM team
		`;

		await connection.release();

		return rows.map(
			(row) =>
				new Team(sql, convertToCase(snakeToCamel, row) as TeamProps),
		);
	}

	static async update(sql:postgres.Sql<any>,teamId:number,pokemonId:number,position:number) {
		const connection = await sql.reserve();

		const pokemon = await connection<TeamPositionProps[]>`
			SELECT * FROM
			team_positions 
			WHERE box_species_id = ${pokemonId}
		`;
		if(pokemon){
			await this.deleteTeamPokemon(sql,pokemonId)
		}
		const [row] = await connection`
			UPDATE team_positions
			SET
				box_species_id=${pokemonId}
			WHERE
				team_id = ${teamId} AND position=${position}
			RETURNING *
		`;

		await connection.release();

	}

	static async deleteTeamPokemon(sql:postgres.Sql<any>,pokemonId:number){
		const connection = await sql.reserve();

		const result = await connection`
			DELETE FROM team_positions
			WHERE box_species_id = ${pokemonId}
		`;

		await connection.release();
	}
	async delete() {
		const connection = await this.sql.reserve();

		const result = await connection`
			DELETE FROM team
			WHERE id = ${this.props.id} AND user_id=${this.props.userId}
		`;

		await connection.release();

		return result.count === 1;
	}
}