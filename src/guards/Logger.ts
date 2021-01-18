import { GuardFunction } from "@typeit/discord";

export const Logger: GuardFunction<"message"> = async (
	[message],
	client,
	next
): Promise<void> => {
	console.log(message);
	await next();
};
