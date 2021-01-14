"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Silence = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const NotBot_1 = require("../guards/NotBot");
const botRoomId = "799012670899879986";
class Silence {
    async silence([message]) {
        // if (message.channel.id === botRoomId) message.reply("epic");
    }
}
tslib_1.__decorate([
    discord_1.On("message"),
    discord_1.Guard(NotBot_1.NotBot),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], Silence.prototype, "silence", null);
exports.Silence = Silence;
//# sourceMappingURL=Silence.js.map