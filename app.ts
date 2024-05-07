import postgres from "postgres";
import Server from "./src/Server";
import { HttpResponse, makeHttpRequest } from "./tests/client";

const sql = postgres({
	database: "MyDB",
});

const server = new Server({
	host: "localhost",
	port: 3000,
	sql,
});

const main = async () => {
	await server.start();

	// const { statusCode, body }: HttpResponse = await makeHttpRequest(
	// 	"GET",
	// 	"/todos",
	// );

	// console.log(statusCode, body);

	// await sql.end();
	// await server.stop();
};

main();
