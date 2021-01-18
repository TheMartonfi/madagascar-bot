import { GuardFunction } from "@typeit/discord";
import { memesCollection } from "../index";

export const MemeCommandExists: GuardFunction<"message"> = async (
	[{ content }],
	client,
	next
): Promise<void> =>
	memesCollection.has(content.toLowerCase()) && (await next());
