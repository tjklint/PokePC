import postgres from "postgres";
import {
	camelToSnake,
	convertToCase,
	createUTCDate,
	snakeToCamel,
} from "../utils";


export interface MoveProps {
	id?: number;
	name:string;
    accuracy:number;
    effect_chance:number;
    pp:number;
    power:number;
}

export interface PokemonSpeciesProps {
	id?: number;
	name:string;
    type:string;
    userImageURL:string;
    entry:string;
    category:string;
}
export interface BoxProps {
	id?: number;
    userId:number;
    name:string;
}
export default class Move {
    constructor(
		private sql: postgres.Sql<any>,
		public props: MoveProps,
	) {}
static async readAll(sql: postgres.Sql<any>): Promise<Move[]> {
    const connection = await sql.reserve();

    const rows = await connection<MoveProps[]>`
        SELECT *
        FROM moves
    `;

    await connection.release();

    return rows.map(
        (row) =>
            new Move(sql, convertToCase(snakeToCamel, row) as MoveProps),
    );
}
static async readAllMovesForPokemon(sql: postgres.Sql<any>,id:number):Promise<Move[]> {
    const connection = await sql.reserve();

    const rows = await connection<MoveProps[]>`
        SELECT *
        FROM pokemon_moves
        WHERE box_species_id=${id}
    `;

    await connection.release();

    return rows.map(
        (row) =>
            new Move(sql, convertToCase(snakeToCamel, row) as MoveProps),
    );
}
}
export class PokemonSpecies {
    constructor(
		private sql: postgres.Sql<any>,
		public props: PokemonSpeciesProps,
	) {}
static async readAll(sql: postgres.Sql<any>): Promise<PokemonSpecies[]> {
    const connection = await sql.reserve();

    const rows = await connection<PokemonSpeciesProps[]>`
        SELECT *
        FROM pokemon_species
    `;

    await connection.release();

    return rows.map(
        (row) =>
            new PokemonSpecies(sql, convertToCase(snakeToCamel, row) as PokemonSpeciesProps),
    );
}
static async read(sql: postgres.Sql<any>, id: number): Promise<PokemonSpecies> {
    const connection = await sql.reserve();

    const [row] = await connection<PokemonSpeciesProps[]>`
        SELECT * FROM
        pokemon_species WHERE id = ${id}
    `;

    await connection.release();

    return new PokemonSpecies(sql, convertToCase(snakeToCamel, row) as PokemonSpeciesProps);
}
}
export class Box {
    constructor(
		private sql: postgres.Sql<any>,
		public props: BoxProps,
	) {}
    static async create(sql: postgres.Sql<any>, props: BoxProps): Promise<Box> {
		const connection = await sql.reserve();

		const [row] = await connection<BoxProps[]>`
			INSERT INTO box
				${sql(convertToCase(camelToSnake, props))}
			RETURNING *
		`;

		await connection.release();

		return new Box(sql, convertToCase(snakeToCamel, row) as BoxProps);
	}
}
