import {
	Discord,
	Client,
	CommandInfos,
	Command,
	CommandMessage,
	On,
	ArgsOf
} from "@typeit/discord";
import { PREFIX } from "./settings";

@Discord(PREFIX, {
	import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
})
export abstract class DiscordApp {
	@On("ready")
	private setActivity(command: ArgsOf<"ready">, { user }: Client) {
		user.setActivity("!help");
	}

	@Command("help")
	private help({ channel }: CommandMessage): void {
		channel.send("https://github.com/TheMartonfi/madagascar-bot");
	}

	@Command("commands")
	private commands({ channel }: CommandMessage): void {
		const privateCommands = ["commands", "count"];

		channel.send(
			Client.getCommands()
				.filter(
					({ commandName }: CommandInfos) =>
						typeof commandName === "string" &&
						!privateCommands.includes(commandName)
				)
				.map(({ commandName }: CommandInfos) => {
					const commandNameWords: string[] = [];

					if (typeof commandName === "string") {
						commandName
							.split(":")
							.forEach((word, index) =>
								commandNameWords.push(
									index === 0 ? word.trim() : `"${word.trim()}"`
								)
							);
					}

					return PREFIX + commandNameWords.join(" ");
				})
				.join("\n")
		);
	}
}
