import { GuardFunction } from "@typeit/discord";

export const OnlyGuild = (guildId: string): GuardFunction => {
	const guard: GuardFunction<"message"> = async (
		[{ guild }],
		client,
		next
	): Promise<void> => {
		if (guild.id === guildId) await next();
	};

	return guard;
};
