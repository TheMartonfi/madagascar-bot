import { GuardFunction } from "@typeit/discord";

export const NotBot: GuardFunction<"message"> = async (
	[message],
	client,
	next
) => client.user.id !== message.author.id && (await next());
