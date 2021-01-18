"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meme = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
const utils_1 = require("../utils");
class Meme {
    memeCommandsSearch({ channel, args: { word } }) {
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
}
tslib_1.__decorate([
    discord_1.Command("meme search :word"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "memeCommandsSearch", null);
exports.Meme = Meme;
//# sourceMappingURL=Meme.js.map