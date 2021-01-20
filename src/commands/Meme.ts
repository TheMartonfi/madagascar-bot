import { Command, CommandMessage, Guard } from "@typeit/discord";
import { Message } from "discord.js";
import { Memes } from "../db";
import { MADAGASCAR_GUILD_ID } from "../settings";
import { OnlyGuild } from "../guards/OnlyGuild";
import {
	formatCommandName,
	makeMessageAttachment,
	getMemeNames
} from "../utils";

export abstract class Meme {
	@Command("search meme :name")
	private async searchMeme({
		channel,
		args: { name }
	}: CommandMessage): Promise<void> {
		const results: string[] = [];
		const formattedName = formatCommandName(name);

		const memeNames = await getMemeNames();
		memeNames.forEach((name) => {
			if (name.search(formattedName) === -1) return;
			results.push(name);
		});

		if (results.length > 1) {
			channel.send(`Found ${results.length} memes: ${results.join(", ")}`);
		} else if (results.length === 1) {
			const meme = await Memes.findOne({ where: { name: formattedName } });
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

	@Command("edit meme :oldName :newName")
	@Guard(OnlyGuild(MADAGASCAR_GUILD_ID))
	private async editMeme({
		channel,
		args: { oldName, newName }
	}: CommandMessage): Promise<void> {
		const formattedOldName = formatCommandName(oldName);
		const formattedNewName = formatCommandName(newName);

		try {
			await Memes.update(
				{ name: formattedNewName },
				{ where: { name: formattedOldName } }
			);
			channel.send(
				`Successfully updated ${formattedOldName} to ${formattedNewName}.`
			);
		} catch (e) {
			if (e.name === "SequelizeUniqueConstraintError") {
				channel.send("That meme already exists.");
			} else {
				channel.send(`There was an error updating ${formattedOldName}.`);
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
