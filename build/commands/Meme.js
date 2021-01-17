"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meme = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const basicCommands_json_1 = require("../basicCommands.json");
const settings_1 = require("../settings");
class Meme {
    basicCommandsSearch({ channel, args: { search } }) {
        const results = [];
        basicCommands_json_1.commands.forEach(({ name }) => {
            if (name.search(String(search).toLowerCase()) === -1)
                return;
            results.push(settings_1.PREFIX + name);
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
], Meme.prototype, "basicCommandsSearch", null);
exports.Meme = Meme;
//# sourceMappingURL=Meme.js.map