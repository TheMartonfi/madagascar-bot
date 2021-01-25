import { GuardFunction } from "@typeit/discord";

export const OnlyGuildOwner: GuardFunction<"message"> = async (
	[message],
	client,
	next
): Promise<void> =>
	message.guild.ownerID === message.author.id
		? await next()
		: message.channel.send("Only the server owner can use this command.");
