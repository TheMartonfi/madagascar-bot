import { On, Guard, ArgsOf } from "@typeit/discord";
import { RICO_USER_ID, RICO_TRIGGER, RICO_ROOM_ID } from "../settings";
import { NotBot } from "../guards/NotBot";
import { OnlyRoom } from "../guards/OnlyRoom";

export abstract class Silence {
	@On("message")
	@Guard(NotBot, OnlyRoom(RICO_ROOM_ID))
	private async silence([command]: ArgsOf<"commandMessage">) {
		const member = await command.guild.members.fetch({ user: RICO_USER_ID });
		if (command.content === RICO_TRIGGER) {
			member.voice.kick();
		}
	}
}
