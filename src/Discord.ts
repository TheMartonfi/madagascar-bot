import {
	Discord,
	Client,
	CommandInfos,
	Command,
	CommandMessage,
	CommandNotFound,
	On,
	Guard,
	ArgsOf
} from "@typeit/discord";
import { Collection } from "discord.js";
import { NotBot } from "./guards/NotBot";
import { PREFIX } from "./settings";
import { Memes, Meme } from "./db";

const commandsCollection = new Collection();
const commands: Meme[] = [];

const getCommands = async (): Promise<void> => {
	const memes = await Memes.findAll({ attributes: ["name", "message"] });

	memes.forEach(({ name, message }: Meme) => {
		commandsCollection.set(PREFIX + name, message);
		commands.push({ name, message });
	});
};

const hasCommand = (message: string): boolean =>
	commandsCollection.has(message);

const getCommand = (message: string): string | unknown =>
	commandsCollection.get(message);

getCommands();

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@On("message")
	@Guard(NotBot)
	private async basicCommands([
		{ content, channel }
	]: ArgsOf<"commandMessage">): Promise<void> {
		const lowerCaseMessage = content.toLowerCase();
		if (!hasCommand(lowerCaseMessage)) return;

		try {
			channel.send(getCommand(lowerCaseMessage));
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
		channel.send(commands.map(({ name }) => PREFIX + name).join(", "));
	}

	@CommandNotFound()
	private notFoundA({ content, channel }: CommandMessage): void {
		if (hasCommand(content.toLowerCase())) return;
		channel.send("Command not found");
	}
}
