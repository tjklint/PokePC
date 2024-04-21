import postgres from "postgres";
import {
	camelToSnake,
	convertToCase,
	createUTCDate,
	snakeToCamel,
} from "../utils";

export interface ModelProps {
	id?: number;
}

export default class Model {
	constructor(
		private sql: postgres.Sql<any>,
		public props: ModelProps,
	) {}

	static async create(sql: postgres.Sql<any>, props: ModelProps): Promise<Model> {
		return new Model(sql, {});
	}

	static async read(sql: postgres.Sql<any>, id: number): Promise<Model> {
		return new Model(sql, {});
	}

	static async readAll(sql: postgres.Sql<any>): Promise<Model[]> {
		return [new Model(sql, {})];
	}

	async update(updateProps: Partial<ModelProps>) {
	}

	async delete() {
	}
}
