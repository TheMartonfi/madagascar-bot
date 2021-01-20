import { Memes } from "./db";
import { PREFIX } from "./settings";
import { MessageAttachment } from "discord.js";

export const formatCommandName = (name: string): string => {
	if (name[0] === PREFIX) name = name.slice(1);

	return String(name).toLowerCase();
};

export const makeMessageAttachment = (
	url: string
): MessageAttachment | string =>
	url.search("discordapp") === -1 ? url : new MessageAttachment(url);

export const getMemeNames = async (): Promise<string[]> => {
	const memes = await Memes.findAll({ attributes: ["name"] });
	const memeNames = memes.map(({ name }) => PREFIX + name);

	return memeNames;
};
