"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Silence = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const settings_1 = require("../settings");
const NotBot_1 = require("../guards/NotBot");
const OnlyRoom_1 = require("../guards/OnlyRoom");
class Silence {
    async silence([command]) {
        const member = await command.guild.members.fetch({ user: settings_1.RICO_USER_ID });
        if (command.content === settings_1.RICO_TRIGGER) {
            member.voice.kick();
        }
    }
}
tslib_1.__decorate([
    discord_1.On("message"),
    discord_1.Guard(NotBot_1.NotBot, OnlyRoom_1.OnlyRoom(settings_1.RICO_ROOM_ID)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], Silence.prototype, "silence", null);
exports.Silence = Silence;
//# sourceMappingURL=Silence.js.map