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
import { Collection, Message } from "discord.js";
import { NotBot } from "./guards/NotBot";
import { PREFIX } from "./settings";
import { commands } from "./basicCommands.json";

const commandsCollection = new Collection();
const hasCommand = (message: string): boolean =>
	commandsCollection.has(message);
const getCommand = (message: string) => commandsCollection.get(message);

commands.forEach(({ name, message }) =>
	commandsCollection.set(PREFIX + name, message)
);

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@On("message")
	@Guard(NotBot)
	private async basicCommands([
		{ content, channel, client }
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
				.join(", ")
		);
	}

	@Command("memes")
	private memes({ channel }: CommandMessage): void {
		channel.send(commands.map(({ name }) => PREFIX + name).join(", "));
	}

	// Extract this into it's own file
	@Command("meme :search")
	private basicCommandsSearch({
		channel,
		args: { search }
	}: CommandMessage): Promise<Message> {
		const results: string[] = [];
		commands.forEach(({ name }) => {
			if (name.search(search.toLowerCase()) === -1) return;
			results.push(name);
		});

		return results.length
			? channel.send(`Found ${results.length}: ${results.join(", ")}`)
			: channel.send("Meme not found");
	}

	@CommandNotFound()
	private notFoundA({ content, channel }: CommandMessage): void {
		if (hasCommand(content.toLowerCase())) return;
		channel.send("Command not found");
	}
}
