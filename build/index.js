"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memesCollection = void 0;
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const settings_1 = require("./settings");
const db_1 = require("./db");
exports.memesCollection = new discord_js_1.Collection();
const start = async () => {
    const client = new discord_1.Client({
        classes: [`${__dirname}/Discord.js`],
        silent: false,
        variablesChar: ":"
    });
    await client.login(settings_1.BOT_TOKEN);
};
const setMemeCommands = async () => {
    const memes = await db_1.Memes.findAll({ attributes: ["name", "message"] });
    memes.forEach(({ name, message }) => {
        exports.memesCollection.set(settings_1.PREFIX + name, message);
    });
};
setMemeCommands();
start();
//# sourceMappingURL=index.js.map