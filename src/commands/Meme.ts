import { Command, CommandMessage } from "@typeit/discord";
import { Message } from "discord.js";
import { memesCollection } from "../index";
import { getMemeNames } from "../utils";

export abstract class Meme {
	@Command("meme :search")
	private memeCommandsSearch({
		channel,
		args: { search }
	}: CommandMessage): Promise<Message> {
		const results: string[] = [];

		getMemeNames().forEach((name) => {
			if (name.search(String(search).toLowerCase()) === -1) return;
			results.push(name);
		});

		return results.length
			? results.length === 1
				? channel.send(memesCollection.get(results[0]))
				: channel.send(`Found ${results.length} memes: ${results.join(", ")}`)
			: channel.send("Meme not found");
	}
}
