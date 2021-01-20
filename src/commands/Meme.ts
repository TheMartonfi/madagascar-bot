import { Command, CommandMessage, Guard } from "@typeit/discord";
import { Message } from "discord.js";
import { MADAGASCAR_GUILD_ID } from "../settings";
import { OnlyGuild } from "../guards/OnlyGuild";
import {
	formatCommandName,
	makeMessageAttachment,
	getMemeNames
} from "../utils";
import { Memes } from "../db";

export abstract class Meme {
	@Command("search meme :word")
	private async searchMeme({
		channel,
		args: { word }
	}: CommandMessage): Promise<void> {
		const results: string[] = [];
		const formattedWord = formatCommandName(word);

		const memeNames = await getMemeNames();
		memeNames.forEach((name) => {
			if (name.search(formattedWord) === -1) return;
			results.push(name);
		});

		if (results.length > 1) {
			channel.send(`Found ${results.length} memes: ${results.join(", ")}`);
		} else if (results.length === 1) {
			const meme = await Memes.findOne({ where: { name: formattedWord } });
			channel.send(makeMessageAttachment(meme.message));
		} else {
			channel.send("Meme not found.");
		}
	}

	@Command("add meme :name")
	@Guard(OnlyGuild(MADAGASCAR_GUILD_ID))
	private async addMeme({
		channel,
		attachments,
		args: { name }
	}: CommandMessage): Promise<void> {
		const formattedName = formatCommandName(name);
		const message = attachments.first()?.url;

		try {
			const meme = await Memes.create({ name: formattedName, message });
			channel.send(`Meme ${meme.name} successfully added.`);
		} catch (e) {
			if (e.name === "SequelizeUniqueConstraintError") {
				channel.send("That meme already exists.");
			} else {
				channel.send(`There was an error adding ${formattedName}.`);
				console.log(e);
			}
		}
	}

	@Command("edit meme :id :name")
	@Guard(OnlyGuild(MADAGASCAR_GUILD_ID))
	private async editMeme({
		channel,
		args: { id, name }
	}: CommandMessage): Promise<void> {
		const formattedId = formatCommandName(id);
		const formattedName = formatCommandName(name);

		try {
			await Memes.update(
				{ name: formattedName },
				{ where: { name: formattedId } }
			);
			channel.send(`Successfully updated ${formattedName}.`);
		} catch (e) {
			if (e.name === "SequelizeUniqueConstraintError") {
				channel.send("That meme already exists.");
			} else {
				channel.send(`There was an error updating ${formattedId}.`);
				console.log(e);
			}
		}
	}

	@Command("delete meme :name")
	@Guard(OnlyGuild(MADAGASCAR_GUILD_ID))
	private async deleteMeme({
		channel,
		args: { name }
	}: CommandMessage): Promise<Message> {
		const formattedName = formatCommandName(name);

		const rowCount = await Memes.destroy({ where: { name: formattedName } });
		if (!rowCount) return channel.send("That meme didn't exist.");

		return channel.send(`Meme ${formattedName} succesfully deleted.`);
	}
}
