import postgres from "postgres";
import {
	camelToSnake,
	convertToCase,
	createUTCDate,
	snakeToCamel,
} from "../utils";
import Move from "../models/Database";
export interface PokemonProps {
	id?: number;
	pokemonId:number;
	userId:number;
	boxId:number;
	level:number;
	nature:string;
	ability:string;
}

export default class Pokemon {
	constructor(
		private sql: postgres.Sql<any>,
		public props: PokemonProps,
	) {}

	static async create(sql: postgres.Sql<any>, props: PokemonProps,movelist:number[]): Promise<Pokemon> {
		const connection = await sql.reserve();

		const boxRows1 = await sql<{ count: number }[]>`
            SELECT COUNT(*) as count
            FROM box_species
			WHERE user_id = ${props.userId} AND box_id = ${props.boxId};
        `;
		const boxRows2 = await sql<{ count: number }[]>`
		SELECT COUNT(*) as count
		FROM box_species
		WHERE user_id = ${props.userId} AND box_id = ${props.boxId+1};
	`;
		if(boxRows1.count == 30){
			if(boxRows2.count == 30){
				props.boxId = props.boxId+2
			}
			else{
				props.boxId = props.boxId+1
			}			
		}

		const [row] = await connection<PokemonProps[]>`
			INSERT INTO box_species
				${sql(convertToCase(camelToSnake, props))}
			RETURNING *
		`;
		const pokemon:Pokemon = new Pokemon(sql, convertToCase(snakeToCamel, row) as PokemonProps)
		for (let i=0;i<movelist.length;i++){
			await connection<Move[]>`
			INSERT INTO pokemon_moves
				(box_species_id,move_id) VALUES(${pokemon.props.id},${movelist[i]})
			RETURNING *
		`;
		}
		await connection.release();

		return pokemon;
	}

	static async read(sql: postgres.Sql<any>, id: number) {
		const connection = await sql.reserve();

		const [row] = await connection<PokemonProps[]>`
			SELECT * FROM
			box_species WHERE id = ${id}
		`;

		await connection.release();
		if(!row){
			return null;
		}
		return new Pokemon(sql, convertToCase(snakeToCamel, row) as PokemonProps);
	}

	static async readAll(sql: postgres.Sql<any>,userId:number): Promise<Pokemon[]> {
		const connection = await sql.reserve();
		//userId will need to be implemented later, can only access their pokemon.
		const rows = await connection<PokemonProps[]>`
			SELECT *
			FROM box_species
			WHERE user_id = ${userId}
		`;

		await connection.release();

		return rows.map(
			(row) =>
				new Pokemon(sql, convertToCase(snakeToCamel, row) as PokemonProps),
		);
	}

	static async update(sql: postgres.Sql<any>,updateProps: Partial<PokemonProps>,id:number,movelist:number[]) {
		const connection = await sql.reserve();
	
		const [row] = await connection`
			UPDATE box_species
			SET
				${sql(convertToCase(camelToSnake, updateProps))}
			WHERE
				id = ${id}
			RETURNING *
		`;
		let currentMoves = await Move.readAllMovesForPokemon(sql,id)
		for (let i=0;i<movelist.length;i++){
			const [placeholder] = await connection<Move[]>`
			UPDATE pokemon_moves
			SET
			move_id = ${movelist[i]}
			WHERE box_species_id = ${id} AND move_id = ${currentMoves[i].moveId}
		`;
		}
		await connection.release();

	}

	static async delete(sql: postgres.Sql<any>,id:number) {
		const connection = await sql.reserve();

		await connection`
			DELETE FROM team_positions
			WHERE box_species_id = ${id}
		`;
		await connection`
			DELETE FROM pokemon_moves
			WHERE box_species_id = ${id}
		`;
		await connection`
		DELETE FROM box_species
		WHERE id = ${id}
		`;
		

		await connection.release();


	}
}
