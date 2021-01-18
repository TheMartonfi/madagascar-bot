import { Client } from "@typeit/discord";
import { Collection } from "discord.js";
import { BOT_TOKEN, PREFIX } from "./settings";
import { Memes } from "./db";

export const memesCollection = new Collection<string, string>();

const start = async (): Promise<void> => {
	const client = new Client({
		classes: [`${__dirname}/Discord.js`],
		silent: false,
		variablesChar: ":"
	});

	await client.login(BOT_TOKEN);
};

const setMemeCommands = async (): Promise<void> => {
	const memes = await Memes.findAll({ attributes: ["name", "message"] });

	memes.forEach(({ name, message }) => {
		memesCollection.set(PREFIX + name, message);
	});
};

setMemeCommands();
start();
