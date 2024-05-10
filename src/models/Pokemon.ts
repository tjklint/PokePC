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

	static async create(sql: postgres.Sql<any>, props: PokemonProps,movelist:Move[]): Promise<Pokemon> {
		const connection = await sql.reserve();

		const boxRows = await sql<{ count: number }[]>`
            SELECT COUNT(*) as count
            FROM box_species;
        `;

		props.boxId = Math.trunc((boxRows.count / 30) + 1);

		const [row] = await connection<PokemonProps[]>`
			INSERT INTO box_species
				${sql(convertToCase(camelToSnake, props))}
			RETURNING *
		`;
		const pokemon:Pokemon = new Pokemon(sql, convertToCase(snakeToCamel, row) as PokemonProps)
		for (let i=0;i<movelist.length;i++){
			const [placeholder] = await connection<Move[]>`
			INSERT INTO pokemon_moves
				(box_species_id,move_id) VALUES(${pokemon.props.id},${movelist[i]})
			RETURNING *
		`;
		}
		await connection.release();

		return pokemon;
	}

	static async read(sql: postgres.Sql<any>, id: number): Promise<Pokemon> {
		const connection = await sql.reserve();

		const [row] = await connection<PokemonProps[]>`
			SELECT * FROM
			box_species WHERE id = ${id}
		`;

		await connection.release();

		return new Pokemon(sql, convertToCase(snakeToCamel, row) as PokemonProps);
	}

	static async readAll(sql: postgres.Sql<any>): Promise<Pokemon[]> {
		const connection = await sql.reserve();
		//userId will need to be implemented later, can only access their pokemon.
		const rows = await connection<PokemonProps[]>`
			SELECT *
			FROM box_species
		`;

		await connection.release();

		return rows.map(
			(row) =>
				new Pokemon(sql, convertToCase(snakeToCamel, row) as PokemonProps),
		);
	}

	async update(updateProps: Partial<PokemonProps>) {
		const connection = await this.sql.reserve();

		const [row] = await connection`
			UPDATE box_species
			SET
				${this.sql(convertToCase(camelToSnake, updateProps))}
			WHERE
				id = ${this.props.id} AND user_id=${this.props.userId}
			RETURNING *
		`;

		await connection.release();

		this.props = { ...this.props, ...convertToCase(snakeToCamel, row) };
	}

	async delete() {
		const connection = await this.sql.reserve();

		const result = await connection`
			DELETE FROM box_species
			WHERE id = ${this.props.id} AND user_id=${this.props.userId}
		`;

		await connection.release();

		return result.count === 1;
	}
}
