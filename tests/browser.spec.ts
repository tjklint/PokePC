import postgres from "postgres";
import { test, expect, Page } from "@playwright/test";
import { getPath } from "../src/url";

const sql = postgres({
	database: "MyDB",
});

const logout = async (page: Page) => {
	await page.goto("/logout");
};

test.beforeEach(async () => {
	// Anything you want to do before each test runs?
});

/**
 * Clean up the database after each test. This function deletes all the rows
 * from the todos and subtodos tables and resets the sequence for each table.
 * @see https://www.postgresql.org/docs/13/sql-altersequence.html
 */
test.afterEach(async ({ page }) => {
	// Replace the table_name with the name of the table(s) you want to clean up.
	const tables = ["table_name"];

	try {
		for (const table of tables) {
			await sql.unsafe(`DELETE FROM ${table}`);
			await sql.unsafe(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1;`);
		}
	} catch (error) {
		console.error(error);
	}

	await logout(page);
});

test("Homepage was retrieved successfully", async ({ page }) => {
	await page.goto("/");

	expect(await page?.title()).toBe("My App");
});
