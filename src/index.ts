import { Client } from "@typeit/discord";
import { BOT_TOKEN } from "./settings";

const start = async (): Promise<void> => {
	const client = new Client({
		classes: [`${__dirname}/Discord.js`],
		silent: false,
		variablesChar: ":"
	});

	await client.login(BOT_TOKEN);
};

start();
