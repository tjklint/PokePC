import postgres from "postgres";
import {
	camelToSnake,
	convertToCase,
	createUTCDate,
	snakeToCamel,
} from "../utils";

export interface TeamProps {
	id?: number;
	userId:number;
	name:string;
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

	static async read(sql: postgres.Sql<any>, id: number): Promise<Team> {
		const connection = await sql.reserve();

		const [row] = await connection<TeamProps[]>`
			SELECT * FROM
			team_positions WHERE id = ${id}
		`;

		await connection.release();

		return new Team(sql, convertToCase(snakeToCamel, row) as TeamProps);
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

	async update(updateProps: Partial<TeamProps>) {
		const connection = await this.sql.reserve();

		const [row] = await connection`
			UPDATE team
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
			DELETE FROM team
			WHERE id = ${this.props.id} AND user_id=${this.props.userId}
		`;

		await connection.release();

		return result.count === 1;
	}
}