"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_1 = require("@typeit/discord");
const settings_1 = require("./settings");
// import { Collection } from "discord.js";
// import { Memes } from "./db";
// export const memesCollection = new Collection<string, string>();
const start = async () => {
    const client = new discord_1.Client({
        classes: [`${__dirname}/Discord.js`],
        silent: false,
        variablesChar: ":"
    });
    await client.login(settings_1.BOT_TOKEN);
};
// const setMemeCommands = async (): Promise<void> => {
// const memes = await Memes.findAll({ attributes: ["name", "message"] });
// 	memes.forEach(({ name, message }) =>
// 		memesCollection.set(PREFIX + name, message)
// 	);
// };
// setMemeCommands();
start();
//# sourceMappingURL=index.js.map