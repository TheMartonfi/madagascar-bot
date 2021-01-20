"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemeNames = exports.makeMessageAttachment = exports.formatCommandName = void 0;
const db_1 = require("./db");
const settings_1 = require("./settings");
const discord_js_1 = require("discord.js");
const formatCommandName = (name) => {
    if (name[0] === settings_1.PREFIX)
        name = name.slice(1);
    return String(name).toLowerCase();
};
exports.formatCommandName = formatCommandName;
const makeMessageAttachment = (url) => url.search("discordapp") === -1 ? url : new discord_js_1.MessageAttachment(url);
exports.makeMessageAttachment = makeMessageAttachment;
const getMemeNames = async () => {
    const memes = await db_1.Memes.findAll({ attributes: ["name"] });
    const memeNames = memes.map(({ name }) => settings_1.PREFIX + name);
    return memeNames;
};
exports.getMemeNames = getMemeNames;
//# sourceMappingURL=utils.js.map