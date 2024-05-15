import postgres from "postgres";
import {
	test,
	describe,
	expect,
	afterEach,
	afterAll,
	beforeEach,
} from "vitest";
import Pokemon,{PokemonProps} from "../src/models/Pokemon"
import Move,{PokemonSpecies,Box,BoxProps} from "../src/models/Database"
import User,{UserProps} from "../src/models/User"
import Team,{TeamProps,TeamPositionProps} from "../src/models/Team"
import { assert } from "console";
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
	beforeEach(async () => {
		let teamProps:TeamProps = {
			name:"Team1",
			userId:1
		}
		await Team.create(sql,teamProps)
		let boxProps:BoxProps = {
			name:"Box1",
			userId:1
		}
		await Box.create(sql,boxProps)
		await createUser()
	});
	const createUser = async (props: Partial<UserProps> = {}) => {
		return await User.create(sql, {
			email: props.email || "user@email.com",
			password: props.password || "password",
			// isAdmin: props.isAdmin || false, // Uncomment if implementing admin feature.
		});
	};
	/**
	 * Clean up the database after each test. This function deletes all the rows
	 * from the todos and subtodos tables and resets the sequence for each table.
	 * @see https://www.postgresql.org/docs/13/sql-altersequence.html
	 */
	afterEach(async () => {
		// Replace the table_name with the name of the table(s) you want to clean up.
		const tables = ["box_species,box,team,team_positions,pokemon_moves"];

		try {
			for (const table of tables) {
				await sql.unsafe(`DELETE FROM ${table}`);
				await sql.unsafe(
					`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1;`,
				);
			}
		} catch (error) {
			console.error(error);
		}
	});
	const createPokemon = async( ) =>{
		let moves:Move[] = await Move.readAll(sql)
		let movelist:Move[] = []
		for(let i =0;i<4;i++){
			movelist[i] = moves[i]
			}
		let props:PokemonProps = {
			id:1,
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

	test("Model test passes!", async () => {
		expect(true).toBe(true);
	});
	test("Pokemon was created.", async () => {
		let pokemon:Pokemon = await createPokemon()
		if(!pokemon.props.id){
			throw new IdIsNull
		}
		let moves:Move[] = await Move.readAllMovesForPokemon(sql,pokemon.props.id)
		expect(pokemon.props.id).toBe(1);
		expect(pokemon.props.pokemonId).toBe(1);
		expect(pokemon.props.userId).toBe(1);
		expect(pokemon.props.boxId).toBe(1);
		expect(pokemon.props.level).toBe(1);
		expect(pokemon.props.nature).toBe("nature");
		expect(pokemon.props.ability).toBe("ability");
		expect(moves[0].props.name).toBe("Flame Burst");
		expect(moves[1].props.name).toBe("Ice Fang");
		expect(moves[2].props.name).toBe("Thunder Strike");
		expect(moves[3].props.name).toBe("Shadow Claw");
	});
	test("Box Pokemon was retrieved.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()

		if(!pokemonCreated.props.id){
			throw new IdIsNull
		}
		let pokemon:Pokemon = await Pokemon.read(sql,pokemonCreated.props.id)

		expect(pokemon.props.id).toBe(1);
		expect(pokemon.props.pokemonId).toBe(1);
		expect(pokemon.props.userId).toBe(1);
		expect(pokemon.props.boxId).toBe(1);
		expect(pokemon.props.level).toBe(1);
		expect(pokemon.props.nature).toBe("nature");
		expect(pokemon.props.ability).toBe("ability");
	});
	test("Pokemon Specie was retrieved.", async() =>{

		let pokemon:PokemonSpecies = await PokemonSpecies.read(sql,1)

		expect(pokemon.props.id).toBe(1);
		expect(pokemon.props.name).toBe("Bulbasaur");
		expect(pokemon.props.type).toBe("Grass/Poison");
		expect(pokemon.props.userImageURL).toBe("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/animated/1.gif");
		expect(pokemon.props.entry).toBe("A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.");
		expect(pokemon.props.category).toBe("Seed Pokémon");
	});
	test("Pokemon Species were retrieved.",async() =>{
		let pokemonSpecies:PokemonSpecies[] = await PokemonSpecies.readAll(sql)
		expect(pokemonSpecies[0].props.id).toBe(1)
		expect(pokemonSpecies[2].props.id).toBe(2)
		expect(pokemonSpecies[3].props.id).toBe(3)
	}) 
	test("Moves were retrieved.", async() =>{

		let moves:Move[] = await Move.readAll(sql)

		expect(moves[0].props.id).toBe(1);
		expect(moves[0].props.name).toBe("Flame Burst");
		expect(moves[0].props.accuracy).toBe(85);
		expect(moves[0].props.effect_chance).toBe(20);
		expect(moves[0].props.pp).toBe(15);
		expect(moves[0].props.power).toBe(70);
	});
	test("Moves for box Pokemon were retrieved.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()
		if(!pokemonCreated.props.id){
			throw new IdIsNull
		}
		let moves:Move[] = await Move.readAllMovesForPokemon(sql,pokemonCreated.props.id)

		expect(moves[0].props.id).toBe(1);
		expect(moves[0].props.name).toBe("Flame Burst");
		expect(moves[0].props.accuracy).toBe(85);
		expect(moves[0].props.effect_chance).toBe(20);
		expect(moves[0].props.pp).toBe(15);
		expect(moves[0].props.power).toBe(70);
	});
	test("Box Pokemon was updated.", async() =>{
		let pokemonCreated:Pokemon = await createPokemon()
		if(!pokemonCreated.props.id){
			throw new IdIsNull
		}
		let moves:Move[] = await Move.readAll(sql)
		let movelist:Move[] = []
		for(let i =0;i<4;i++){
			movelist[i] = moves[i+1]
			}
		let props:Partial<PokemonProps> = {
			level:2,
			nature:"updated",
			ability:"update"
		}
		await Pokemon.update(sql,props,pokemonCreated.props.id,movelist)
		let pokemon:Pokemon = await Pokemon.read(sql,pokemonCreated.props.id)
		moves = await Move.readAllMovesForPokemon(sql,pokemonCreated.props.id)
		expect(pokemon.props.id).toBe(1);
		expect(pokemon.props.pokemonId).toBe(1);
		expect(pokemon.props.userId).toBe(1);
		expect(pokemon.props.boxId).toBe(1);
		expect(pokemon.props.level).toBe(1);
		expect(pokemon.props.nature).toBe("nature");
		expect(pokemon.props.ability).toBe("ability");
		expect(moves[0].props.name).toBe("Ice Fang");
		expect(moves[1].props.name).toBe("Thunder Strike");
		expect(moves[2].props.name).toBe("Shadow Claw");
		expect(moves[3].props.name).toBe("Rock Slide");
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
	
});
