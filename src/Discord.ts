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
import { NotBot } from "./guards/NotBot";
import { PREFIX } from "./settings";
import { getMemeNames } from "./utils";
import { memesCollection } from "./index";
import { MemeCommandExists } from "./guards/MemeCommandExists";

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@On("message")
	@Guard(NotBot, MemeCommandExists)
	private async memeCommands([
		{ content, channel }
	]: ArgsOf<"commandMessage">): Promise<void> {
		try {
			channel.send(memesCollection.get(content.toLowerCase()));
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
