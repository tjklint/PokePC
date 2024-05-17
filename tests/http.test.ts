import postgres from "postgres";
import { StatusCode } from "../src/router/Response";
import { HttpResponse, clearCookieJar, makeHttpRequest } from "./client";
import { test, describe, expect, afterEach, beforeEach,afterAll } from "vitest";
import User,{UserProps} from "../src/models/User"
import Pokemon,{PokemonProps} from "../src/models/Pokemon"
import Team,{TeamProps,TeamPositionProps, SamePositionSamePokemon} from "../src/models/Team"
describe("HTTP operations", () => {
	const sql = postgres({
		database: "MyDB",
	});

	beforeEach(async () => {
		await createUser()
		
	});

	/**
	 * Clean up the database after each test. This function deletes all the rows
	 * from the todos and subtodos tables and resets the sequence for each table.
	 * @see https://www.postgresql.org/docs/13/sql-altersequence.html
	 */
	afterEach(async () => {
		// Replace the table_name with the name of the table(s) you want to clean up.
		const tables = ["team_positions","pokemon_moves","box_species","box","team","users"];

		try {			
				await sql.unsafe(`DROP TABLE IF EXISTS team_positions CASCADE;
				CREATE TABLE team_positions (
						team_id INT,
						box_species_id INT,
						position INT,
						PRIMARY KEY (team_id, box_species_id),
						FOREIGN KEY (team_id) REFERENCES team(id),
						FOREIGN KEY (box_species_id) REFERENCES box_species(id)
				);
				DROP TABLE IF EXISTS pokemon_moves CASCADE;
				CREATE TABLE pokemon_moves (
						box_species_id INT,
						move_id INT,
						PRIMARY KEY (box_species_id, move_id),
						FOREIGN KEY (box_species_id) REFERENCES box_species(id),
						FOREIGN KEY (move_id) REFERENCES moves(id)
				);				
				DROP TABLE IF EXISTS box_species CASCADE;
				CREATE TABLE box_species (
						id SERIAL PRIMARY KEY,
						pokemon_id INTEGER REFERENCES pokemon_species(id),
						user_id INTEGER REFERENCES users(id),
						box_id INTEGER REFERENCES box(id),
						level INTEGER,
						nature VARCHAR(50),
						ability VARCHAR(50)
				);
				DROP TABLE IF EXISTS team CASCADE;
				CREATE TABLE team (
						id SERIAL PRIMARY KEY,
						name VARCHAR(100),
						user_id INTEGER REFERENCES users(id)
				);
				DROP TABLE IF EXISTS box CASCADE;
				CREATE TABLE box (
						id SERIAL PRIMARY KEY,
						name VARCHAR(100),
						user_id INTEGER REFERENCES users(id)
				);
				DROP TABLE IF EXISTS users CASCADE; 
				CREATE TABLE users (
						id SERIAL PRIMARY KEY,
						password VARCHAR(200) NOT NULL,
						email VARCHAR(100) NOT NULL
				);`);
		} catch (error) {
			console.error(error);
		}

		await makeHttpRequest("GET", "/logout");
		clearCookieJar();
	});
	const createUser = async () => {
		return await User.create(sql, {
			email: "user@email.com",
			password:"password",
		});
	};
	const login = async (
		email: string = "user@email.com",
		password: string = "password",
	) => {
		await makeHttpRequest("POST", "/login", {
			email,
			password,
		});
	};

	test("Homepage was retrieved successfully.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/",
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(Object.keys(body).includes("message")).toBe(true);
		expect(Object.keys(body).includes("payload")).toBe(true);
		expect(body.message).toBe("Homepage!");
	});

	test("Invalid path returned error.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/foo",
		);

		expect(statusCode).toBe(StatusCode.NotFound);
		expect(Object.keys(body).includes("message")).toBe(true);
		expect(Object.keys(body).includes("payload")).toBe(false);
		expect(body.message).toBe("Invalid route: GET /foo");
	});
	test("Pokemon was created", async () => {
		await login();
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"POST",
			"/box/:boxid/pokemon/:pokemonId/",
			{
				pokemonId:1,
				userId:1,
				boxId:1,
				level:2,
				nature:"nature",
				ability:"ability",
			}
		);

		expect(statusCode).toBe(StatusCode.Created);
		expect(Object.keys(body).includes("message")).toBe(true);
		expect(Object.keys(body).includes("payload")).toBe(false);
		expect(body.message).toBe("Pokemon Created!");
		expect(Object.keys(body.payload.pokemon).includes("id")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("userId")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("boxId")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("level")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("nature")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("ability")).toBe(true);
		expect(body.payload.pokemon.id).toBe(1);
		expect(body.payload.pokemon.userId).toBe(1);
		expect(body.payload.pokemon.boxId).toBe(1);
		expect(body.payload.pokemon.level).toBe(2);
		expect(body.payload.pokemon.nature).toBe("nature")
		expect(body.payload.pokemon.ability).toBe("ability");
	});
	
	test("Pokemon was updated.", async () => {
		await login();

		let moves:number[] = [1,2,3,4]
		let pokemon = await Pokemon.create(sql,{
			pokemonId:1,
				userId:1,
				boxId:1,
				level:2,
				nature:"nature",
				ability:"ability",
		},moves)
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"PUT",
			`/box/${pokemon.props.boxId}/pokemon/${pokemon.props.id}/`,
			{
				level:3,
			}
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(Object.keys(body).includes("message")).toBe(true);
		expect(Object.keys(body).includes("payload")).toBe(false);
		expect(body.message).toBe("Pokemon Updated!");
		expect(Object.keys(body.payload.pokemon).includes("id")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("userId")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("boxId")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("level")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("nature")).toBe(true);
		expect(Object.keys(body.payload.pokemon).includes("ability")).toBe(true);
		expect(body.payload.pokemon.level).toBe(3);
	});
	test("Box Pokemon was retrieved.", async () => {
		await login();

		let moves:number[] = [1,2,3,4]
		let pokemon = await Pokemon.create(sql,{
			pokemonId:1,
				userId:1,
				boxId:1,
				level:2,
				nature:"nature",
				ability:"ability",
		},moves)
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			`/box/${pokemon.props.boxId}/pokemon/${pokemon.props.id}/`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe(`Retrieved Pokémon details for box ${pokemon.props.boxId}, Pokémon ${pokemon.props.pokemonId}`);
		expect(body.payload.pokemon.id).toBe(pokemon.props.id);
		expect(body.payload.pokemon.userId).toBe(pokemon.props.userId);
		expect(body.payload.pokemon.boxId).toBe(pokemon.props.boxId);
		expect(body.payload.pokemon.level).toBe(pokemon.props.level);
		expect(body.payload.pokemon.nature).toBe(pokemon.props.nature);
		expect(body.payload.pokemon.ability).toBe(pokemon.props.ability);
	});
	test("Box Pokemon were retrieved.", async () => {
		await login();

		let moves:number[] = [1,2,3,4]
		let pokemon = await Pokemon.create(sql,{
				pokemonId:1,
				userId:1,
				boxId:1,
				level:2,
				nature:"nature",
				ability:"ability",
		},moves)
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			`/box/${pokemon.props.boxId}/pokemon`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe(`Retrieved Pokémon for box ${pokemon.props.boxId}`);
		expect(body.payload.pokemons[0].id).toBe(pokemon.props.id);
		expect(body.payload.pokemons[0].userId).toBe(pokemon.props.userId);
		expect(body.payload.pokemons[0].boxId).toBe(pokemon.props.boxId);
		expect(body.payload.pokemons[0].level).toBe(pokemon.props.level);
		expect(body.payload.pokemons[0].nature).toBe(pokemon.props.nature);
		expect(body.payload.pokemons[0].ability).toBe(pokemon.props.ability);
	});
	test("Pokemon was deleted.", async () => {
		await login();

		let moves:number[] = [1,2,3,4]
		let pokemon = await Pokemon.create(sql,{
			pokemonId:1,
				userId:1,
				boxId:1,
				level:2,
				nature:"nature",
				ability:"ability",
		},moves)
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"DELETE",
			`/box/${pokemon.props.boxId}/pokemon/${pokemon.props.id}/`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe("Pokemon Deleted!");
	});
	test("Pokemon not added due to unauthenticated user.", async () => {

		
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"POST",
			"/box/1/pokemon/1/",
			{
				pokemonId:1,
				userId:1,
				boxId:1,
				level:2,
				nature:"nature",
				ability:"ability",
			},
		);

		expect(statusCode).toBe(StatusCode.Unauthorized);
		expect(body.message).toBe("Unauthorized");
	});
	test("Pokemon not updated due to unauthenticated user.", async () => {
		let moves:number[] = [1,2,3,4]
		let pokemon = await Pokemon.create(sql,{
				pokemonId:1,
				userId:1,
				boxId:1,
				level:2,
				nature:"nature",
				ability:"ability",
		},moves)
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"PUT",
			"/box/1/pokemon/update/1",
		);

		expect(statusCode).toBe(StatusCode.Unauthorized);
		expect(body.message).toBe("Unauthorized");
	});
	test("Pokemon not deleted due to unauthenticated user.", async () => {
		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"DELETE",
			"/box/1/pokemon/1",
		);

		expect(statusCode).toBe(StatusCode.Unauthorized);
		expect(body.message).toBe("Unauthorized");
	});
	test("A Pokemon not retrieved due to unauthenticated user.", async () => {

		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/box/1/pokemon/1",
		);

		expect(statusCode).toBe(StatusCode.Unauthorized);
		expect(body.message).toBe("Unauthorized");
	});
	test("Box Pokemon not retrieved due to unauthenticated user.", async () => {

		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			"/box/1/pokemon",
		);

		expect(statusCode).toBe(StatusCode.Unauthorized);
		expect(body.message).toBe("Unauthorized");
	});
	test("Teams were retrieved.", async () => {
		await login();

		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			`/team`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe(`All Teams Retrieved!`);
		expect(body.payload.teams[0].id).toBe(1);
		expect(body.payload.teams[0].name).toBe("Team1");
		expect(body.payload.teams[0].userId).toBe(1);
	});
	// test("Team Pokemon were retrieved.", async () => {
	// 	await login();
	// 	let moves:number[] = [1,2,3,4]
	// 	let pokemon = await Pokemon.create(sql,{
	// 		pokemonId:1,
	// 			userId:1,
	// 			boxId:1,
	// 			level:2,
	// 			nature:"nature",
	// 			ability:"ability",
	// 	},moves)

	// 	if(!pokemon.props.id){
	// 		throw new SamePositionSamePokemon
	// 	}
	// 	await Team.insert(sql,1,pokemon.props.id,1)
	// 	const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 		"GET",
	// 		`/team/1/pokemon`,
	// 	);

	// 	expect(statusCode).toBe(StatusCode.OK);
	// 	expect(body.message).toBe(`Team Pokemon Retrieved!`);
	// 	expect(body.payload.teampokemon[0].id).toBe(pokemon.props.pokemonId);
	// 	expect(body.payload.teams[0].name).toBe("Bulbasaur");
	// });
	// test("Dex Pokemon were retrieved.", async () => {
	// 	await login();

	// 	const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 		"GET",
	// 		`/dex/pokemon`,
	// 	);

	// 	expect(statusCode).toBe(StatusCode.OK);
	// 	expect(body.message).toBe(`"Dex Pokemon Were Retrieved!"`);
	// 	expect(body.payload.pokemon[0].id).toBe(1);
	// 	expect(body.payload.pokemon[0].name).toBe("Bulbasaur");
	// });
	test("A Dex Pokemon was retrieved.", async () => {
		await login();

		const { statusCode, body }: HttpResponse = await makeHttpRequest(
			"GET",
			`/dex/pokemon/1`,
		);

		expect(statusCode).toBe(StatusCode.OK);
		expect(body.message).toBe(`Dex Pokemon Retrieved!`);
		expect(body.payload.pokemon.id).toBe(1);
		expect(body.payload.pokemon.name).toBe("Bulbasaur");
	});
});
