import {
	Discord,
	Client,
	CommandInfos,
	Command,
	CommandMessage,
	CommandNotFound
} from "@typeit/discord";

const commandPrefix = "!";
@Discord(commandPrefix, {
	import: [`${__dirname}/commands/*.js`]
})
export abstract class DiscordApp {
	@Command("commands")
	private commands(command: CommandMessage) {
		const commandsList = Client.getCommands().map(
			(command: CommandInfos) => commandPrefix + command.commandName
		);

		command.reply(commandsList.join(", "));
	}

	@CommandNotFound()
	private notFoundA(command: CommandMessage) {
		command.reply("Command not found");
	}
}
