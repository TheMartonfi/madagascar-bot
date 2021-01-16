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
import { commands } from "./basicCommands.json";

const commandsCollection = new Collection();

const findCommand = (message: string) => commandsCollection.has(message);

commands.forEach(({ name, message }) =>
	commandsCollection.set(PREFIX + name, message)
);

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@Command("commands")
	private commands({ channel }: CommandMessage) {
		channel.send(
			Client.getCommands()
				.map(({ commandName }: CommandInfos) => PREFIX + commandName)
				.join(", ")
		);
	}

	@Command("memes")
	private memes({ channel }: CommandMessage) {
		channel.send(commands.map(({ name }) => PREFIX + name).join(", "));
	}

	@On("message")
	@Guard(NotBot)
	private async basicCommands([
		{ content, channel }
	]: ArgsOf<"commandMessage">) {
		const lowerCaseMessage = content.toLowerCase();
		if (!findCommand(lowerCaseMessage)) return;

		try {
			const commandMessage = commandsCollection.get(lowerCaseMessage);
			channel.send(commandMessage);
		} catch (e) {
			channel.send(`nah it brokey`);
			console.log(e);
		}
	}

	@CommandNotFound()
	private notFoundA({ content, channel }: CommandMessage) {
		if (findCommand(content.toLowerCase())) return;
		channel.send("Command not found");
	}
}
