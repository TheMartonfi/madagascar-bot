"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordApp = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const settings_1 = require("./settings");
const index_1 = require("./index");
const utils_1 = require("./utils");
const NotBot_1 = require("./guards/NotBot");
const MemeCommandExists_1 = require("./guards/MemeCommandExists");
let DiscordApp = class DiscordApp {
    async logger([command]) { }
    async memeCommands([{ content, channel }]) {
        try {
            const formattedCommandName = utils_1.formatCommandName(content);
            const attachment = new discord_js_1.MessageAttachment(index_1.memesCollection.get(formattedCommandName));
            if (typeof attachment.attachment === "string") {
                if (attachment.attachment.search("discordapp") !== -1) {
                    channel.send(attachment);
                }
                else {
                    channel.send(index_1.memesCollection.get(formattedCommandName));
                }
            }
        }
        catch (e) {
            channel.send(`Something went wrong`);
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
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DiscordApp.prototype, "logger", null);
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