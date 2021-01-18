import { Client } from "@typeit/discord";
import { Collection } from "discord.js";
import { BOT_TOKEN, PREFIX } from "./settings";
import { Memes, Meme } from "./db";

export const commands: Meme[] = [];
export const commandsCollection = new Collection<string, string>();

const start = async () => {
	const client = new Client({
		classes: [`${__dirname}/Discord.js`],
		silent: false,
		variablesChar: ":"
	});

	await client.login(BOT_TOKEN);
};

const setCommands = async (): Promise<void> => {
	const memes = await Memes.findAll({ attributes: ["name", "message"] });

	memes.forEach((meme) => {
		commands.push(meme);
		commandsCollection.set(PREFIX + meme.name, meme.message);
	});
};

setCommands();
start();
