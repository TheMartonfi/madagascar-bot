import { On, Guard, ArgsOf } from "@typeit/discord";
import { NotBot } from "../guards/NotBot";

const botRoomId = "799012670899879986";

export abstract class Silence {
	@On("message")
	@Guard(NotBot)
	private async silence([message]: ArgsOf<"message">) {
		// if (message.channel.id === botRoomId) message.reply("epic");
	}
}
