"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordApp = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
let DiscordApp = class DiscordApp {
    notFoundA(command) {
        command.reply("Command not found");
    }
};
tslib_1.__decorate([
    discord_1.CommandNotFound(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "notFoundA", null);
DiscordApp = tslib_1.__decorate([
    discord_1.Discord("!", {
        import: [`${__dirname}/commands/*.js`]
    })
], DiscordApp);
exports.DiscordApp = DiscordApp;
//# sourceMappingURL=Discord.js.map