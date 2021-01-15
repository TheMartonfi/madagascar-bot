import { Command, CommandMessage } from "@typeit/discord";

export abstract class Help {
	@Command("help")
	private help(command: CommandMessage) {
		command.channel.send("No");
	}
}
