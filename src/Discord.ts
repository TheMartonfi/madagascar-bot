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
import { getMemeNames } from "./utils";
import { NotBot } from "./guards/NotBot";
import { MemeCommandExists } from "./guards/MemeCommandExists";
import { Logger } from "./guards/Logger";

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@On("message")
	@Guard(Logger)
	private async logger([command]: ArgsOf<"commandMessage">) {
		// const attachmentUrl = command.attachments.first().url;
		// console.log(attachmentUrl);
	}

	@On("message")
	@Guard(NotBot, MemeCommandExists)
	private async memeCommands([
		{ content, channel, guild }
	]: ArgsOf<"commandMessage">): Promise<void> {
		console.log(guild.id);
		try {
			const attachment = new MessageAttachment(
				memesCollection.get(content.toLowerCase())
			);

			channel.send(attachment);
		} catch (e) {
			channel.send(`nah it brokey`);
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
