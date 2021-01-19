import { Command, CommandMessage, Guard } from "@typeit/discord";
import { Message, MessageAttachment } from "discord.js";
import { PREFIX, MADAGASCAR_GUILD_ID } from "../settings";
import { OnlyGuild } from "../guards/OnlyGuild";
import { memesCollection } from "../index";
import { getMemeNames } from "../utils";
import { Memes } from "../db";

export abstract class Meme {
	@Command("meme search :word")
	private memeSearch({
		channel,
		args: { word }
	}: CommandMessage): Promise<Message> {
		const results: string[] = [];

		getMemeNames().forEach((name) => {
			if (name.search(String(word).toLowerCase()) === -1) return;
			results.push(name);
		});

		return results.length
			? results.length === 1
				? channel.send(new MessageAttachment(memesCollection.get(results[0])))
				: channel.send(`Found ${results.length} memes: ${results.join(", ")}`)
			: channel.send("Meme not found");
	}

	@Command("meme add :name")
	@Guard(OnlyGuild(MADAGASCAR_GUILD_ID))
	private async memeAdd({
		channel,
		attachments,
		args: { name }
	}: CommandMessage): Promise<Message> {
		const message = attachments.first()?.url;

		// add check for name
		if (message) {
			if (name[0] === PREFIX) name = name.slice(1).toLowerCase();

			const meme = await Memes.create({ name, message });
			return channel.send(`${meme.name} successfully added`);
		}

		return channel.send("Please provide a meme");
	}

	@Command("meme edit :id :name")
	@Guard(OnlyGuild(MADAGASCAR_GUILD_ID))
	private async memeEdit({
		channel,
		attachments,
		args: { id, name }
	}: CommandMessage): Promise<Message> {
		const message = attachments.first()?.url;

		if (message) {
			// Create formatCommandName function that lower cases and removes prefix if present
			if (id[0] === PREFIX) id = id.slice(1).toLowerCase();
			if (name[0] === PREFIX) name = name.slice(1).toLowerCase();

			try {
				await Memes.update({ name, message }, { where: { name: id } });
			} catch (e) {
				console.log(e);
				return channel.send(`There was an error updating ${id}`);
			}

			return channel.send(`Successfully updated ${name}`);
		}

		return channel.send("Please provide a meme");
	}
}
