import { Command, CommandMessage, Guard } from "@typeit/discord";
import { WordCounts } from "../db";
import { MADAGASCAR_GUILD_ID, RICO_TRIGGER } from "../settings";
import { OnlyGuild } from "../guards/OnlyGuild";

// Private feature
export abstract class Count {
	@Command("count")
	@Guard(OnlyGuild(MADAGASCAR_GUILD_ID))
	private async count({ channel }: CommandMessage): Promise<void> {
		const wordCount = await WordCounts.findOne({
			where: { word: RICO_TRIGGER }
		});

		channel.send(`${wordCount.get("word")} count: ${wordCount.get("count")}`);
	}
}
