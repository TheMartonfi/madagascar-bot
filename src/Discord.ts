import {
	Discord,
	Client,
	CommandInfos,
	Command,
	CommandMessage,
	On,
	Guard,
	ArgsOf
} from "@typeit/discord";
import { MessageAttachment } from "discord.js";
import { PREFIX } from "./settings";
import { memesCollection } from "./index";
import { getMemeNames, formatCommandName } from "./utils";
import { NotBot } from "./guards/NotBot";
import { MemeCommandExists } from "./guards/MemeCommandExists";
import { Logger } from "./guards/Logger";

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@On("message")
	// @Guard(Logger)
	private async logger([command]: ArgsOf<"commandMessage">): Promise<void> {}

	@On("message")
	@Guard(NotBot, MemeCommandExists)
	private async memeCommands([
		{ content, channel }
	]: ArgsOf<"commandMessage">): Promise<void> {
		try {
			const formattedCommandName = formatCommandName(content);
			const attachment = new MessageAttachment(
				memesCollection.get(formattedCommandName)
			);

			if (typeof attachment.attachment === "string") {
				if (attachment.attachment.search("discordapp") !== -1) {
					channel.send(attachment);
				} else {
					channel.send(memesCollection.get(formattedCommandName));
				}
			}
		} catch (e) {
			channel.send(`Something went wrong`);
			console.log(e);
		}
	}

	@Command("commands")
	private commands({ channel }: CommandMessage): void {
		channel.send(
			Client.getCommands()
				.map(({ commandName }: CommandInfos) => PREFIX + commandName)
				.filter((name) => name !== "!commands")
				.join(", ")
		);
	}

	@Command("memes")
	private memes({ channel }: CommandMessage): void {
		channel.send(getMemeNames().join(", "));
	}
}
