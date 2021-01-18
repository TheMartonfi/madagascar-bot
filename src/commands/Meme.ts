import { Command, CommandMessage } from "@typeit/discord";
import { Message } from "discord.js";
import { getMemeNames } from "../utils";

export abstract class Meme {
	@Command("meme :search")
	private basicCommandsSearch({
		channel,
		args: { search }
	}: CommandMessage): Promise<Message> {
		const results: string[] = [];

		getMemeNames().forEach((name) => {
			if (name.search(String(search).toLowerCase()) === -1) return;
			results.push(name);
		});

		return results.length
			? channel.send(`Found ${results.length}: ${results.join(", ")}`)
			: channel.send("Meme not found");
	}
}
