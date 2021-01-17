import { Command, CommandMessage } from "@typeit/discord";
import { WordCounts } from "../db";
import { RICO_TRIGGER } from "../settings";

export abstract class Count {
	@Command("count")
	private async count({ channel }: CommandMessage): Promise<void> {
		const wordCount = await WordCounts.findOne({
			where: { word: RICO_TRIGGER }
		});

		channel.send(`${wordCount.get("word")} count: ${wordCount.get("count")}`);
	}
}
