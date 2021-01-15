import { GuardFunction } from "@typeit/discord";

export const OnlyRoom = (roomId: string) => {
	const guard: GuardFunction<"message"> = async ([message], client, next) => {
		if (message.channel.id === roomId) await next();
	};

	return guard;
};
