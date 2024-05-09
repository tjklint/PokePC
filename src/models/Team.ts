import postgres from "postgres";
import {
	camelToSnake,
	convertToCase,
	createUTCDate,
	snakeToCamel,
} from "../utils";
import Pokemon from "./Pokemon"
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
			this.update(sql,teamId,pokemonId,position)
		}
		else{
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

		return row
	}
	static async read(sql: postgres.Sql<any>): Promise<Pokemon[]> {
		const connection = await sql.reserve();
		//userId will need to be implemented later, can only access their pokemon.
		const rows = await connection<TeamPositionProps[]>`
			SELECT *
			FROM team_positions
		`;

		await connection.release();
		let teamPositions:TeamPositionProps[] = rows.map(
			(row) =>
				 convertToCase(snakeToCamel, row) as TeamPositionProps,
		);
		let pokemonList:Pokemon[] = []
		for (let i=0;i<rows.length;i++){
			pokemonList[i] = await Pokemon.read(sql,teamPositions[i].boxSpeciesId)
		}
		return pokemonList
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