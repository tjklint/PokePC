import postgres from "postgres";
import { test, describe, expect, afterEach, beforeEach,afterAll } from "vitest";
import Pokemon,{PokemonProps} from "../src/models/Pokemon"
import Move,{PokemonSpecies,Box,BoxProps} from "../src/models/Database"
import User,{UserProps} from "../src/models/User"
import Team,{TeamProps,TeamPositionProps} from "../src/models/Team"
import { assert } from "console";
import { Exception } from "handlebars";
describe("CRUD operations", () => {
	// Set up the connection to the DB.
	const sql = postgres({
		database: "MyDB",
	});
	class IdIsNull extends Error {
		constructor() {
			super("Pokemon id is null.");
		}
	}
	class PokemonNotFound extends Error {
		constructor() {
			super("Pokemon not found.");
		}
	}
	beforeEach(async () => {
		await createUser()
		
	});
	const createUser = async (props: Partial<UserProps> = {}) => {
		return await User.create(sql, {
			email:"user@email.com",
			password: "password",
		});
	};
	/**
	 * Clean up the database after each test. This function deletes all the rows
	 * from the todos and subtodos tables and resets the sequence for each table.
	 * @see https://www.postgresql.org/docs/13/sql-altersequence.html
	 */
	afterEach(async () => {
		// Replace the table_name with the name of the table(s) you want to clean up.
		const tables = ["team_positions","pokemon_moves","box_species","box","team","users"];

		try {
				await sql.unsafe(`
				DROP TABLE IF EXISTS team_positions CASCADE;
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
				);
				`);
		} catch (error) {
			console.error(error);
		}
	});
	const createPokemon = async( ) =>{

		let movelist:number[] = [1,2,3,4]
		let props:PokemonProps = {
			pokemonId:1,
			userId:1,
			boxId:1,
			level:1,
			nature:"nature",
			ability:"ability"

		}
		return await Pokemon.create(sql, props, movelist);
	}
	// Close the connection to the DB after all tests are done.
	afterAll(async () => {
		await sql.end();
	});

	test("Pokemon was created.", async () => {
		let pokemon:Pokemon = await createPokemon()
		if(!pokemon.props.id){
			throw new IdIsNull
		}
		let moves = await Move.readAllMovesForPokemon(sql,pokemon.props.id)
		expect(pokemon.props.id).toBe(1);
		expect(pokemon.props.pokemonId).toBe(1);
		expect(pokemon.props.userId).toBe(1);
		expect(pokemon.props.boxId).toBe(1);
		expect(pokemon.props.level).toBe(1);
		expect(pokemon.props.nature).toBe("nature");
		expect(pokemon.props.ability).toBe("ability");
		expect(moves[0].moveId).toBe(1);
		expect(moves[1].moveId).toBe(2);
		expect(moves[2].moveId).toBe(3);
		expect(moves[3].moveId).toBe(4);
	});
	test("Box Pokemon was retrieved.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()

		if(!pokemonCreated.props.id){
			throw new IdIsNull
		}
		let pokemon = await Pokemon.read(sql,pokemonCreated.props.id)
		if(!pokemon){
			throw new PokemonNotFound
		}
		expect(pokemon.props.pokemonId).toBe(pokemonCreated.props.pokemonId);
		expect(pokemon.props.userId).toBe(pokemonCreated.props.userId);
		expect(pokemon.props.boxId).toBe(pokemonCreated.props.boxId);
		expect(pokemon.props.level).toBe(pokemonCreated.props.level);
		expect(pokemon.props.nature).toBe(pokemonCreated.props.nature);
		expect(pokemon.props.ability).toBe(pokemonCreated.props.ability);
	});
	test("Pokemon Species was retrieved.", async() =>{

		let pokemon:PokemonSpecies = await PokemonSpecies.read(sql,1)

		expect(pokemon.props.id).toBe(1);
		expect(pokemon.props.name).toBe("Bulbasaur");
		expect(pokemon.props.type).toBe("Grass/Poison");
		expect(pokemon.props.userimageurl).toBe("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif");
		expect(pokemon.props.entry).toBe("A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.");
		expect(pokemon.props.category).toBe("Seed Pokémon");
	});
	test("Pokemon Species were retrieved.",async() =>{
		let pokemonSpecies:PokemonSpecies[] = await PokemonSpecies.readAll(sql)
		expect(pokemonSpecies[0].props.id).toBe(1)
		expect(pokemonSpecies[1].props.id).toBe(2)
		expect(pokemonSpecies[2].props.id).toBe(3)
	}) 
	test("Moves were retrieved.", async() =>{

		let moves:Move[] = await Move.readAll(sql)

		expect(moves[0].props.id).toBe(1);
		expect(moves[0].props.name).toBe("Flame Burst");
		expect(moves[0].props.accuracy).toBe(85);
		expect(moves[0].props.effectChance).toBe(20);
		expect(moves[0].props.pp).toBe(15);
		expect(moves[0].props.power).toBe(70);
	});
	test("Moves for box Pokemon were retrieved.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()
		let pokemonMoves:number[] = [1,2,3,4]
		if(!pokemonCreated.props.id){
			throw new IdIsNull
		}
		let moves = await Move.readAllMovesForPokemon(sql,pokemonCreated.props.id)

		expect(moves[0].moveId).toBe(pokemonMoves[0]);
		expect(moves[1].moveId).toBe(pokemonMoves[1]);
		expect(moves[2].moveId).toBe(pokemonMoves[2]);
		expect(moves[3].moveId).toBe(pokemonMoves[3]);
	});
	test("Box Pokemon was updated.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()
		if(!pokemonCreated.props.id){
			throw new IdIsNull
		}
		let movelist:number[] = [2,3,4,5]

		let props:Partial<PokemonProps> = {
			level:2,
			nature:"updated",
			ability:"updated"
		}
		await Pokemon.update(sql,props,pokemonCreated.props.id,movelist)
		let pokemon = await Pokemon.read(sql,pokemonCreated.props.id)
		if(!pokemon){
			throw new PokemonNotFound
		}
		let pokemonMoves = await Move.readAllMovesForPokemon(sql,pokemonCreated.props.id)
		expect(pokemon.props.id).toBe(1);
		expect(pokemon.props.pokemonId).toBe(1);
		expect(pokemon.props.userId).toBe(1);
		expect(pokemon.props.boxId).toBe(1);
		expect(pokemon.props.level).toBe(2);
		expect(pokemon.props.nature).toBe("updated");
		expect(pokemon.props.ability).toBe("updated");
		expect(pokemonMoves[0].moveId).toBe(2);
	});
	test("Box Pokemon was deleted.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()
		if(!pokemonCreated.props.id){
			throw new IdIsNull
		}
		await Pokemon.delete(sql,pokemonCreated.props.id);

		const deletedPokemon = await Pokemon.read(sql,pokemonCreated.props.id)

		expect(deletedPokemon).toBeNull();
	});
	test("Box Pokemon were retrieved", async() => {
		let pokemonCreated1:Pokemon = await createPokemon()
		let pokemonCreated2:Pokemon = await createPokemon()

		const allBoxPokemon:Pokemon[] = await Pokemon.readAll(sql,1)

		expect(allBoxPokemon).toBeInstanceOf(Array);
		expect(allBoxPokemon).toContainEqual(pokemonCreated1);
		expect(allBoxPokemon).toContainEqual(pokemonCreated2);
	});
	test("Box is created.", async() => {

		let boxProps:BoxProps = {
			name:"Box1",
			userId:1
		}
		let box:Box = await Box.create(sql,boxProps)
		expect(box.props.name).toBe("Box1");
		expect(box.props.userId).toBe(1);
	});
	test("Team is created.", async() =>{
		let teamProps:TeamProps = {
			name:"Team1",
			userId:1
		}
		let team:Team = await Team.create(sql,teamProps)
		expect(team.props.name).toBe("Team1");
		expect(team.props.userId).toBe(1);
	});
	test("Pokemon inserted into empty position.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()
		let teamProps:TeamProps = {
			name:"Team1",
			userId:1
		}
		let team:Team = await Team.create(sql,teamProps)
		if(!team.props.id || !pokemonCreated.props.id){
			throw new IdIsNull
		}
		await Team.insert(sql,team.props.id,pokemonCreated.props.id,1)
		let teamPokemon:Pokemon[] = await Team.read(sql,team.props.id)
		expect(teamPokemon[0].props.id).toBe(pokemonCreated.props.id)
	})
	test("Pokemon inserted into non empty position.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()
		let teamProps:TeamProps = {
			name:"Team1",
			userId:1
		}
		let team:Team = await Team.create(sql,teamProps)
		if(!team.props.id || !pokemonCreated.props.id){
			throw new IdIsNull
		}
		await Team.insert(sql,team.props.id,pokemonCreated.props.id,1)
		let pokemonCreated2:Pokemon = await createPokemon()
		if(!pokemonCreated2.props.id){
			throw new IdIsNull
		}
		await Team.insert(sql,team.props.id,pokemonCreated2.props.id,1)
		let teamPokemon:Pokemon[] = await Team.read(sql,team.props.id)
		expect(teamPokemon[0].props.id).toBe(pokemonCreated.props.id)
	})
	test("Specific Team is Retrieved.", async() => {

		let team:Team = await Team.readTeam(sql,1)
		expect(team.props.id).toBe(1)
		expect(team.props.name).toBe("Team1")
		expect(team.props.userId).toBe(1)
	})
	test("Teams were retrieved.", async() => {
		let teamProps:TeamProps = {
			name:"Team2",
			userId:1
		}
		let teamProps2:TeamProps = {
			name:"Team3",
			userId:1
		}
		let team1:Team = await Team.create(sql,teamProps)
		let team2:Team = await Team.create(sql,teamProps2)

		const allTeams:Team[] = await Team.readAll(sql)

		expect(allTeams).toBeInstanceOf(Array);
		expect(allTeams).toContainEqual(team1);
		expect(allTeams).toContainEqual(team2);
	})
});
