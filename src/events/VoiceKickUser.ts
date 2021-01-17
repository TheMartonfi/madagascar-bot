import { On, Guard, ArgsOf } from "@typeit/discord";
import { WordCounts } from "../db";
import { RICO_USER_ID, RICO_TRIGGER, RICO_ROOM_ID } from "../settings";
import { NotBot } from "../guards/NotBot";
import { OnlyRoom } from "../guards/OnlyRoom";
import { OnlyWord } from "../guards/OnlyWord";

export abstract class VoiceKickUser {
	@On("message")
	@Guard(NotBot, OnlyRoom(RICO_ROOM_ID), OnlyWord(RICO_TRIGGER))
	private async voiceKickUser([
		{ guild, channel }
	]: ArgsOf<"commandMessage">): Promise<void> {
		try {
			const member = await guild.members.fetch({ user: RICO_USER_ID });
			member.voice.kick();

			const wordCount = await WordCounts.findOne({
				where: { word: RICO_TRIGGER }
			});

			wordCount.increment("count");
		} catch (e) {
			channel.send("nah it brokey");
			console.log(e);
		}
	}
}
