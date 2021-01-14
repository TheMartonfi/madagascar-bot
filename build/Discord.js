"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordApp = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const commandPrefix = "!";
let DiscordApp = class DiscordApp {
    commands(command) {
        const commandsList = discord_1.Client.getCommands().map((command) => commandPrefix + command.commandName);
        command.reply(commandsList.join(", "));
    }
    notFoundA(command) {
        command.reply("Command not found");
    }
};
tslib_1.__decorate([
    discord_1.Command("commands"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "commands", null);
tslib_1.__decorate([
    discord_1.CommandNotFound(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "notFoundA", null);
DiscordApp = tslib_1.__decorate([
    discord_1.Discord(commandPrefix, {
        import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
        // import: [`${__dirname}/commands/*.js`]
    })
], DiscordApp);
exports.DiscordApp = DiscordApp;
//# sourceMappingURL=Discord.js.map