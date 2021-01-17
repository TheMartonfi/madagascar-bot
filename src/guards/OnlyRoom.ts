import { GuardFunction } from "@typeit/discord";

export const OnlyRoom = (roomId: string): GuardFunction => {
	const guard: GuardFunction<"message"> = async (
		[{ channel }],
		client,
		next
	): Promise<void> => {
		if (channel.id === roomId) await next();
	};

	return guard;
};
