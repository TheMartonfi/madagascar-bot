import { Command, CommandMessage } from "@typeit/discord";

export abstract class Help {
	@Command("help")
	private help({ channel }: CommandMessage): void {
		channel.send("No");
	}
}
