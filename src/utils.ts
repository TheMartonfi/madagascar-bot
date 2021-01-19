import { memesCollection } from "./index";
import { PREFIX } from "./settings";

export const getMemeNames = (): string[] => {
	const memeNames: string[] = [];
	for (const [name] of memesCollection.entries()) {
		memeNames.push(name);
	}

	return memeNames;
};

export const formatCommandName = (name: string): string => {
	if (name[0] === PREFIX) name = name.slice(1);

	return name.toLowerCase();
};
