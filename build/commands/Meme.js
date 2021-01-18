"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meme = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const utils_1 = require("../utils");
class Meme {
    memeCommandsSearch({ channel, args: { search } }) {
        const results = [];
        utils_1.getMemeNames().forEach((name) => {
            if (name.search(String(search).toLowerCase()) === -1)
                return;
            results.push(name);
        });
        return results.length
            ? channel.send(`Found ${results.length}: ${results.join(", ")}`)
            : channel.send("Meme not found");
    }
}
tslib_1.__decorate([
    discord_1.Command("meme :search"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "memeCommandsSearch", null);
exports.Meme = Meme;
//# sourceMappingURL=Meme.js.map