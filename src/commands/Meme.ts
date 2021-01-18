import { Command, CommandMessage } from "@typeit/discord";
import { Message, MessageAttachment } from "discord.js";
import { memesCollection } from "../index";
import { getMemeNames } from "../utils";

export abstract class Meme {
	@Command("meme search :word")
	private memeCommandsSearch({
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

	// const attachmentUrl = command.attachments.first().url;
	// console.log(attachmentUrl);
}
