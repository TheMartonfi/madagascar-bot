import { Client } from "@typeit/discord";
import { BOT_TOKEN } from "./settings";
import { info } from "./settings";

const start = async (): Promise<void> => {
	const client = new Client({
		classes: [`${__dirname}/Discord.{js, ts}`],
		silent: false,
		variablesChar: ":"
	});

	await client.login(BOT_TOKEN);
	console.log(info("Bot gracefully logged in."));
};

start();
