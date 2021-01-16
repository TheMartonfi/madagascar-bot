import { GuardFunction } from "@typeit/discord";

export const OnlyWord = (word: string) => {
	const guard: GuardFunction<"message"> = async (
		[{ content }],
		client,
		next
	) => {
		if (content === word) await next();
	};

	return guard;
};
