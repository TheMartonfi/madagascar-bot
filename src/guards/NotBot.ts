import { GuardFunction } from "@typeit/discord";

export const NotBot: GuardFunction<"message"> = async (
	[message],
	client,
	next
): Promise<void> => client.user.id !== message.author.id && (await next());
