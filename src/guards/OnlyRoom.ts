import { GuardFunction } from "@typeit/discord";

export const OnlyRoom = (roomId: string) => {
	const guard: GuardFunction<"message"> = async (
		[{ channel }],
		client,
		next
	) => {
		if (channel.id === roomId) await next();
	};

	return guard;
};
