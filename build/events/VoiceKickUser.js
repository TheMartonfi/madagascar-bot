"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceKickUser = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const db_1 = require("../db");
const settings_1 = require("../settings");
const NotBot_1 = require("../guards/NotBot");
const OnlyRoom_1 = require("../guards/OnlyRoom");
const OnlyWord_1 = require("../guards/OnlyWord");
class VoiceKickUser {
    async voiceKickUser([{ guild, channel }]) {
        try {
            const member = await guild.members.fetch({ user: settings_1.RICO_USER_ID });
            member.voice.kick();
            const wordCount = await db_1.WordCounts.findOne({
                where: { word: settings_1.RICO_TRIGGER }
            });
            wordCount.increment("count");
        }
        catch (e) {
            channel.send("nah it brokey");
            console.log(e);
        }
    }
}
tslib_1.__decorate([
    discord_1.On("message"),
    discord_1.Guard(NotBot_1.NotBot, OnlyRoom_1.OnlyRoom(settings_1.RICO_ROOM_ID), OnlyWord_1.OnlyWord(settings_1.RICO_TRIGGER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VoiceKickUser.prototype, "voiceKickUser", null);
exports.VoiceKickUser = VoiceKickUser;
//# sourceMappingURL=VoiceKickUser.js.map