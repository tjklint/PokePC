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
}