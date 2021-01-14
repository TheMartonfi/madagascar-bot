"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Silence = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const NotBot_1 = require("../guards/NotBot");
class Silence {
    async silence([command]) {
        const wordJarRoomId = "748827509956804618";
        // Extract this check into a guard
        if (command.channel.id === wordJarRoomId) {
            const ricoId = "239891983751970824";
            const roleName = "toxic";
            const trigger = "🇳 +1";
            const role = command.guild.roles.cache.find((role) => role.name === roleName);
            const member = command.guild.member(ricoId);
            if (command.content === trigger)
                member.roles.add(role);
        }
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