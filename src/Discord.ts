import { PREFIX } from "./settings";
import {
	Discord,
	Client,
	CommandInfos,
	Command,
	CommandMessage,
	CommandNotFound
} from "@typeit/discord";

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@Command("commands")
	private commands(command: CommandMessage) {
		const commandList = Client.getCommands().map(
			(command: CommandInfos) => PREFIX + command.commandName
		);

		command.channel.send(commandList.join(", "));
	}

	@CommandNotFound()
	private notFoundA(command: CommandMessage) {
		command.channel.send("Command not found");
	}
}
