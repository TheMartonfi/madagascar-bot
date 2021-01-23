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
import { Message } from "discord.js";
import { Memes } from "./db";
import { error } from "./settings";
import { PREFIX } from "./settings";
import {
	formatCommandName,
	makeMessageAttachment,
	getMemeNames
} from "./utils";
import { NotBot } from "./guards/NotBot";

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@On("ready")
	private setActivity(command: ArgsOf<"ready">, client: Client) {
		client.user.setActivity("!help");
	}

	@On("message")
	@Guard(NotBot)
	private async memeCommands([
		{ content, channel }
	]: ArgsOf<"commandMessage">): Promise<void> {
		try {
			if (content[0] !== PREFIX) return;

			const formattedCommandName = formatCommandName(content);
			const meme = await Memes.findOne({
				where: { name: formattedCommandName }
			});

			if (!meme) return;

			channel.send(makeMessageAttachment(meme.message));
		} catch (e) {
			console.log(error(e));
		}
	}

	@Command("commands")
	private commands({ channel }: CommandMessage): void {
		const privateCommands = ["commands", "count"];

		channel.send(
			Client.getCommands()
				.filter(
					({ commandName }: CommandInfos) =>
						typeof commandName === "string" &&
						!privateCommands.includes(commandName)
				)
				.map(({ commandName }: CommandInfos) => {
					const commandNameWords: string[] = [];

					if (typeof commandName === "string") {
						commandName
							.split(":")
							.forEach((word, index) =>
								commandNameWords.push(
									index === 0 ? word.trim() : `"${word.trim()}"`
								)
							);
					}

					return PREFIX + commandNameWords.join(" ");
				})
				.join("\n")
		);
	}

	@Command("memes")
	private async memes({ channel }: CommandMessage): Promise<Message> {
		const memeNames = await getMemeNames();

		if (memeNames.length) return channel.send(memeNames.join(", "));
		channel.send("No memes were found.");
	}
}
