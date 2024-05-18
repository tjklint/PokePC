import postgres from "postgres";
import { test, expect, Page } from "@playwright/test";
import { getPath } from "../src/url";
import User, { UserProps } from "../src/models/User";
import { createUTCDate } from "../src/utils";

const sql = postgres({
	database: "MyDB",
});

const createUser = async (props: Partial<UserProps> = {}) => {
	return await User.create(sql, {
		email: props.email || "user@email.com",
		password: props.password || "password",
	})
}

const logout = async (page: Page) => {
	await page.goto("/logout");
};


test.afterEach(async () => {	
	try {			
        await sql.unsafe(`
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

/**
 * Clean up the database after each test. This function deletes all the rows
 * from the todos and subtodos tables and resets the sequence for each table.
 * @see https://www.postgresql.org/docs/13/sql-altersequence.html
 */
test.afterEach(async ({ page }) => {

	const tables = ["users"];

	try {
			await sql.unsafe(`
            DROP TABLE IF EXISTS users CASCADE; 
            CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    password VARCHAR(200) NOT NULL,
                    email VARCHAR(100) NOT NULL
            );`);
	} catch (error) {
		console.error(error);
	}

	await logout(page);
});

test("Homepage was retrieved successfully", async ({ page }) => {
	await page.goto("/");

	expect(await page?.title()).toBe("PokePC");
});


test("User was registered.", async ({ page }) => {
	await page.goto('/register');
	await page.fill('#email', "user@email.com");
	await page.fill('#password', "Password123");
	await page.fill('#confirmPassword', "Password123");
	await page.click('#register-form-submit-button');

	expect(await page.url()).toBe('/login');
});

test("User was not registered with blank email.", async ({ page }) => {
    await page.goto('/register');
    await page.fill('#password', "Password123");
    await page.fill('#confirmPassword', "Password123");
    await page.click('#register-form-submit-button');

    expect(await page.url()).toContain('/register');
    const errorElement = await page.$('.box'); 

    const errorMessage = await errorElement?.innerText(); 
    if (errorMessage) {
        expect(errorMessage).toContain("Email is required"); 
    } else {
        throw new Error("Error element not found or empty.");
    }
});


test("User was not registered with mismatched passwords.", async ({ page }) => {
	await page.goto('/register');
	await page.fill('#email', "user@email.com");
	await page.fill('#password', "Password123");
	await page.fill('#confirmPassword', "Password124");
	await page.click('#register-form-submit-button');

	expect(await page.url()).toContain('/register');
	const errorElement = await page.$('.box'); 

    const errorMessage = await errorElement?.innerText(); 

	if (errorElement) {
		expect(await errorElement.innerText()).toBe("Passwords do not match");
	} else {
		throw new Error("Error element not found.");
	}
});

test("User was logged in.", async ({ page }) => {
    const user = await createUser({ email: "user@example.com", password: "Password123" });

    await page.goto(`/`);
    let loginElement = await page.$(`nav a[href="${getPath("login")}"]`);
    let logoutElement = await page.$(`nav a[href="${getPath("logout")}"]`);

    expect(await loginElement).toBeTruthy();
    expect(await logoutElement).toBeFalsy();

    await loginElement?.click();
    await page.fill('#login-email', "user@example.com");
    await page.fill('#login-password', "Password123");
    await page.click('#login-form-submit-button');

    expect(await page.url()).toBe(getPath("box/addpokemon"));

    loginElement = await page.$(`nav a[href="${getPath("login")}"]`);
    logoutElement = await page.$(`nav a[href="${getPath("logout")}"]`);

    expect(await loginElement).toBeFalsy();
    expect(await logoutElement).toBeTruthy();
});

test("User was not logged in with blank email.", async ({ page }) => {
    await page.goto(`/login`);

    await page.fill('#login-password', "Password123");
    await page.click('#login-form-submit-button');

    expect(await page.url()).toMatch(getPath("login"));

    const errorText = await page.$eval(".box", el => el.textContent);

    if (errorText) {
        expect(errorText).toMatch("Email is required.");
    } else {
        throw new Error("Error element not found or empty.");
    }
});

test("User was not logged in with incorrect password.", async ({ page }) => {
    const user = await createUser({ email: "user@example.com", password: "Password123" });

    await page.goto(`/login`);

    await page.fill('#login-email', "user@example.com");
    await page.fill('#login-password', "TheWrongPassword:p");
    await page.click('#login-form-submit-button');

    expect(await page.url()).toMatch(getPath("login"));

    const errorText = await page.$eval(".box", el => el.textContent);

    if (errorText) {
        expect(errorText).toMatch("Invalid credentials.");
    } else {
        throw new Error("Error element not found or empty.");
    }
});

test("User was logged out.", async ({ page, context }) => {
    const user = await createUser({ email: "user@example.com", password: "Password123" });

    expect((await context.cookies()).length).toBe(0);

    await page.goto('/login');

    expect((await context.cookies()).length).toBeGreaterThan(0);

    await page.fill('#login-email', "user@example.com");
    await page.fill('#login-password', "Password123");
    await page.click('#login-form-submit-button');

    await page.waitForURL(getPath("box/addpokemon"));  
    expect(page.url()).toContain(getPath("box/addpokemon"));

    const logoutElement = await page.waitForSelector(`nav a[href="${getPath("logout")}"]`);  
    await logoutElement.click();

    await page.waitForURL(getPath(""));
    expect(page.url()).toBe(getPath(""));

    const loginElement = await page.waitForSelector(`nav a[href="${getPath("login")}"]`); 
    expect(loginElement).toBeTruthy();
});

test("User's email was remembered.", async ({ page }) => {
    const user = await createUser({ email: "user@email.com", password: "Password123" });

    await page.goto('/login');

    await page.fill('#login-email', "user@email.com"); 
    await page.fill('#login-password', "Password123"); 

    await page.check('#login-remember'); 

    await page.click('#login-form-submit-button');  

    const cookies = await page.context().cookies();

    const emailCookie = cookies.find((cookie) => cookie.name === "email");

    expect(emailCookie).toBeTruthy();  
    expect(emailCookie?.value).toBe("user@email.com"); 
});

