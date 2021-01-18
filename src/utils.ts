import { memesCollection } from "./index";

export const getMemeNames = (): string[] => {
	const memeNames: string[] = [];
	for (const [name] of memesCollection.entries()) {
		memeNames.push(name);
	}

	return memeNames;
};
