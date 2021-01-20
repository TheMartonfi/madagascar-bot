"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Count = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const db_1 = require("../db");
const settings_1 = require("../settings");
const OnlyGuild_1 = require("../guards/OnlyGuild");
class Count {
    async count({ channel }) {
        const wordCount = await db_1.WordCounts.findOne({
            where: { word: settings_1.RICO_TRIGGER }
        });
        channel.send(`${wordCount.get("word")} count: ${wordCount.get("count")}`);
    }
}
tslib_1.__decorate([
    discord_1.Command("count"),
    discord_1.Guard(OnlyGuild_1.OnlyGuild(settings_1.MADAGASCAR_GUILD_ID)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Count.prototype, "count", null);
exports.Count = Count;
//# sourceMappingURL=Count.js.map