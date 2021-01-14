import dotenv from "dotenv";
import { Client } from "@typeit/discord";

dotenv.config();
const { TOKEN } = process.env;

const start = async () => {
	const client = new Client({
		classes: [
			`${__dirname}/*Discord.ts`, // glob string to load the classes
			`${__dirname}/*Discord.js` // If you compile using "tsc" the file extension change to .js
		],
		silent: false,
		variablesChar: ":"
	});

	await client.login(TOKEN);
};

start();
