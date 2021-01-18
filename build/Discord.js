"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordApp = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const NotBot_1 = require("./guards/NotBot");
const settings_1 = require("./settings");
const utils_1 = require("./utils");
const index_1 = require("./index");
const MemeCommandExists_1 = require("./guards/MemeCommandExists");
let DiscordApp = class DiscordApp {
    async memeCommands([{ content, channel }]) {
        try {
            channel.send(index_1.memesCollection.get(content.toLowerCase()));
        }
        catch (e) {
            channel.send(`nah it brokey`);
            console.log(e);
        }
    }
    commands({ channel }) {
        channel.send(discord_1.Client.getCommands()
            .map(({ commandName }) => settings_1.PREFIX + commandName)
            .filter((name) => name !== "!commands")
            .join(", "));
    }
    memes({ channel }) {
        channel.send(utils_1.getMemeNames().join(", "));
    }
};
tslib_1.__decorate([
    discord_1.On("message"),
    discord_1.Guard(NotBot_1.NotBot, MemeCommandExists_1.MemeCommandExists),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DiscordApp.prototype, "memeCommands", null);
tslib_1.__decorate([
    discord_1.Command("commands"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "commands", null);
tslib_1.__decorate([
    discord_1.Command("memes"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "memes", null);
DiscordApp = tslib_1.__decorate([
    discord_1.Discord(settings_1.PREFIX, {
        import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
    })
], DiscordApp);
exports.DiscordApp = DiscordApp;
//# sourceMappingURL=Discord.js.map