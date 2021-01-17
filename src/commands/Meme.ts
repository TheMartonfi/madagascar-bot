import { Command, CommandMessage } from "@typeit/discord";
import { Message } from "discord.js";
import { commands } from "../basicCommands.json";
import { PREFIX } from "../settings";

export abstract class Meme {
	@Command("meme :search")
	private basicCommandsSearch({
		channel,
		args: { search }
	}: CommandMessage): Promise<Message> {
		const results: string[] = [];
		commands.forEach(({ name }) => {
			if (name.search(String(search).toLowerCase()) === -1) return;
			results.push(PREFIX + name);
		});

		return results.length
			? channel.send(`Found ${results.length}: ${results.join(", ")}`)
			: channel.send("Meme not found");
	}
}
