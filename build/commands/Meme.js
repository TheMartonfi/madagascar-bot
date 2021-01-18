"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meme = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const settings_1 = require("../settings");
const index_1 = require("../index");
const utils_1 = require("../utils");
const db_1 = require("../db");
class Meme {
    memeSearch({ channel, args: { word } }) {
        const results = [];
        utils_1.getMemeNames().forEach((name) => {
            if (name.search(String(word).toLowerCase()) === -1)
                return;
            results.push(name);
        });
        return results.length
            ? results.length === 1
                ? channel.send(new discord_js_1.MessageAttachment(index_1.memesCollection.get(results[0])))
                : channel.send(`Found ${results.length} memes: ${results.join(", ")}`)
            : channel.send("Meme not found");
    }
    async memeAdd({ channel, attachments, args: { name } }) {
        var _a;
        const message = (_a = attachments.first()) === null || _a === void 0 ? void 0 : _a.url;
        if (message) {
            if (name[0] === settings_1.PREFIX)
                name = name.slice(1);
            name = name.toLowerCase();
            const meme = await db_1.Memes.create({ name, message });
            return channel.send(`${meme.name} successfully added`);
        }
        return channel.send("Please provide a meme");
    }
}
tslib_1.__decorate([
    discord_1.Command("meme search :word"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "memeSearch", null);
tslib_1.__decorate([
    discord_1.Command("meme add :name"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "memeAdd", null);
exports.Meme = Meme;
//# sourceMappingURL=Meme.js.map