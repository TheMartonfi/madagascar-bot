import { Command, CommandMessage } from "@typeit/discord";
import { Message, MessageAttachment } from "discord.js";
import { PREFIX } from "../settings";
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
	private async memeAdd({
		channel,
		attachments,
		args: { name }
	}: CommandMessage): Promise<Message> {
		const message = attachments.first()?.url;

		if (message) {
			if (name[0] === PREFIX) name = name.slice(1);
			name = name.toLowerCase();

			const meme = await Memes.create({ name, message });
			return channel.send(`${meme.name} successfully added`);
		}

		return channel.send("Please provide a meme");
	}
}
