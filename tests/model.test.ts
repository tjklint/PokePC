import postgres from "postgres";
import {
	test,
	describe,
	expect,
	afterEach,
	afterAll,
	beforeEach,
} from "vitest";

describe("CRUD operations", () => {
	// Set up the connection to the DB.
	const sql = postgres({
		database: "MyDB",
	});

	beforeEach(async () => {
		// Anything you want to do before each test runs?
	});

	/**
	 * Clean up the database after each test. This function deletes all the rows
	 * from the todos and subtodos tables and resets the sequence for each table.
	 * @see https://www.postgresql.org/docs/13/sql-altersequence.html
	 */
	afterEach(async () => {
		// Replace the table_name with the name of the table(s) you want to clean up.
		const tables = ["table_name"];

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

	// Close the connection to the DB after all tests are done.
	afterAll(async () => {
		await sql.end();
	});

	test("Model test passes!", async () => {
		expect(true).toBe(true);
	});
});
