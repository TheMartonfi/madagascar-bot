import dotenv from "dotenv";
import { Client } from "@typeit/discord";

dotenv.config();
const { TOKEN } = process.env;

const start = async () => {
	const client = new Client({
		classes: [`${__dirname}/Discord.js`],
		silent: false,
		variablesChar: ":"
	});

	if (typeof TOKEN === "string") await client.login(TOKEN);
};

start();
