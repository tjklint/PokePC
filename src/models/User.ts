import postgres from "postgres";
import {
	camelToSnake,
	convertToCase,
	createUTCDate,
	snakeToCamel,
} from "../utils";
import { BoxProps,Box } from "./Database";
import Team,{TeamProps} from "./Team"
export interface UserProps {
	id?: number;
	email: string;
	password: string;
	profile?:string;
}

export class DuplicateEmailError extends Error {
	constructor() {
		super("User with this email already exists.");
	}
}

export class InvalidCredentialsError extends Error {
	constructor() {
		super("Invalid credentials.");
	}
}

export default class User {
	constructor(
		private sql: postgres.Sql<any>,
		public props: UserProps,
	) {}

	static async read(
		sql: postgres.Sql<any>,
		id: number,
	): Promise<User> {
		const connection = await sql.reserve();

		const [row] = await connection<UserProps[]>`
			SELECT * FROM
			users WHERE id = ${id}
		`;

		await connection.release();

		if (!row) {
			throw InvalidCredentialsError
		}

		return new User(sql, convertToCase(snakeToCamel, row) as UserProps);
	}
	/**
	 * TODO: Implement this method. It should insert a new
	 * row into the "users" table with the provided props.
	 */
	static async create(
		sql: postgres.Sql<any>,
		props: UserProps,
	): Promise<User> {

		
			const connection = await sql.reserve();
	
			let [row] = await connection<UserProps[]>`
			SELECT * FROM
			users WHERE email=${props.email}
			`;

			if(row){
				throw new DuplicateEmailError
			}
			[row] = await connection<UserProps[]>`
				INSERT INTO users
					${sql(convertToCase(camelToSnake, props))}
				RETURNING *
			`;
			let user:User = new User(sql, convertToCase(snakeToCamel, row) as UserProps)
			if(user.props.id){
				let boxProps:BoxProps={
					userId:user.props.id,
					name:"Box1"
				};
				for(let i=0;i<3;i++){
					boxProps.name=`Box${i+1}`
					Box.create(sql,boxProps)					
				}
				let teamProps:TeamProps={
					userId:user.props.id,
					name:"Team1"
				}
				Team.create(sql,teamProps)
			}
			
			
			
			await connection.release();
	
			return new User(sql, convertToCase(snakeToCamel, row) as UserProps);
		
	}

	/**
	 * TODO: To "log in" a user, we need to check if the
	 * provided email and password match an existing row
	 * in the database. If they do, we return a new User instance.
	 */
	static async login(
		sql: postgres.Sql<any>,
		email: string,
		password: string,
	): Promise<User> 
	{
		    const connection = await sql.reserve();	

			const [row] = await connection<UserProps[]>`
			SELECT * FROM
			users WHERE email=${email} AND password=${password}
			`;
			if(!row){
				throw new InvalidCredentialsError
			}
			return new User(sql, convertToCase(snakeToCamel, row) as UserProps);
	}
	static async update(
		sql: postgres.Sql<any>,
		props: UserProps,
		id: number,
	){
		const connection = await sql.reserve();

		
			let [row] = await connection<UserProps[]>`
			SELECT * FROM
			users WHERE email=${props.email}
			`;
			let foundProps:UserProps = convertToCase(snakeToCamel, row) as UserProps;
			//Assures that were not just finding the user that already exists email.
			//The ids must be different.
			if(foundProps.id != undefined && foundProps.id != id){
				throw new DuplicateEmailError
			}
			
			
		
		[row] = await connection`
			UPDATE users
			SET
				${sql(convertToCase(camelToSnake, props))}
			WHERE
				id = ${id}
			RETURNING *
		`;

		await connection.release();
	
	}
}