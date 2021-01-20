"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordApp = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const db_1 = require("./db");
const settings_1 = require("./settings");
const utils_1 = require("./utils");
const NotBot_1 = require("./guards/NotBot");
let DiscordApp = class DiscordApp {
    async memeCommands([{ content, channel }]) {
        try {
            const formattedCommandName = utils_1.formatCommandName(content);
            const meme = await db_1.Memes.findOne({
                where: { name: formattedCommandName }
            });
            if (!meme)
                return;
            channel.send(utils_1.makeMessageAttachment(meme.message));
        }
        catch (e) {
            channel.send(`Something went wrong.`);
            console.log(e);
        }
    }
    commands({ channel }) {
        const privateCommands = ["!commands", "!count"];
        channel.send(discord_1.Client.getCommands()
            .map(({ commandName }) => settings_1.PREFIX + commandName)
            .filter((name) => !privateCommands.includes(name))
            .join(", "));
    }
    async memes({ channel }) {
        const memeNames = await utils_1.getMemeNames();
        channel.send(memeNames.join(", "));
    }
};
tslib_1.__decorate([
    discord_1.On("message"),
    discord_1.Guard(NotBot_1.NotBot),
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
    tslib_1.__metadata("design:returntype", Promise)
], DiscordApp.prototype, "memes", null);
DiscordApp = tslib_1.__decorate([
    discord_1.Discord(settings_1.PREFIX, {
        import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
    })
], DiscordApp);
exports.DiscordApp = DiscordApp;
//# sourceMappingURL=Discord.js.map