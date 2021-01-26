import { PREFIX } from "./settings";

export const formatCommandName = (name: string): string => {
	if (name[0] === PREFIX) name = name.slice(1);

	return String(name).toLowerCase();
};
