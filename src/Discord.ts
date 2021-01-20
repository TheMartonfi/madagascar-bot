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
import { Memes } from "./db";
import { PREFIX } from "./settings";
import {
	formatCommandName,
	makeMessageAttachment,
	getMemeNames
} from "./utils";
import { NotBot } from "./guards/NotBot";
import { Logger } from "./guards/Logger";

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@On("message")
	// @Guard(Logger)
	private async logger([command]: ArgsOf<"commandMessage">): Promise<void> {}

	@On("message")
	@Guard(NotBot)
	private async memeCommands([
		{ content, channel }
	]: ArgsOf<"commandMessage">): Promise<void> {
		try {
			const formattedCommandName = formatCommandName(content);
			const meme = await Memes.findOne({
				where: { name: formattedCommandName }
			});

			if (!meme) return;

			channel.send(makeMessageAttachment(meme.message));
		} catch (e) {
			channel.send(`Something went wrong.`);
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
	private async memes({ channel }: CommandMessage): Promise<void> {
		const memeNames = await getMemeNames();
		channel.send(memeNames.join(", "));
	}
}
