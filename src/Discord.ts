import { Discord, CommandMessage, CommandNotFound } from "@typeit/discord";

@Discord("!", {
	import: [`${__dirname}/commands/*.js`]
})
export abstract class DiscordApp {
	@CommandNotFound()
	notFoundA(command: CommandMessage) {
		command.reply("Command not found");
	}
}
