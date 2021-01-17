import { GuardFunction } from "@typeit/discord";

export const OnlyWord = (word: string): GuardFunction => {
	const guard: GuardFunction<"message"> = async (
		[{ content }],
		client,
		next
	): Promise<void> => {
		if (content === word) await next();
	};

	return guard;
};
