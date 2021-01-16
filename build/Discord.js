"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordApp = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const NotBot_1 = require("./guards/NotBot");
const settings_1 = require("./settings");
const basicCommands_json_1 = require("./basicCommands.json");
const commandsCollection = new discord_js_1.Collection();
const findCommand = (message) => commandsCollection.has(message);
basicCommands_json_1.commands.forEach(({ name, message }) => commandsCollection.set(settings_1.PREFIX + name, message));
let DiscordApp = class DiscordApp {
    commands({ channel }) {
        channel.send(discord_1.Client.getCommands()
            .map(({ commandName }) => settings_1.PREFIX + commandName)
            .join(", "));
    }
    memes({ channel }) {
        channel.send(basicCommands_json_1.commands.map(({ name }) => settings_1.PREFIX + name).join(", "));
    }
    async basicCommands([{ content, channel }]) {
        const lowerCaseMessage = content.toLowerCase();
        if (!findCommand(lowerCaseMessage))
            return;
        try {
            const commandMessage = commandsCollection.get(lowerCaseMessage);
            channel.send(commandMessage);
        }
        catch (e) {
            channel.send(`nah it brokey`);
            console.log(e);
        }
    }
    notFoundA({ content, channel }) {
        if (findCommand(content.toLowerCase()))
            return;
        channel.send("Command not found");
    }
};
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
tslib_1.__decorate([
    discord_1.On("message"),
    discord_1.Guard(NotBot_1.NotBot),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DiscordApp.prototype, "basicCommands", null);
tslib_1.__decorate([
    discord_1.CommandNotFound(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "notFoundA", null);
DiscordApp = tslib_1.__decorate([
    discord_1.Discord(settings_1.PREFIX, {
        import: [`${__dirname}/commands/*.js`, `${__dirname}/events/*.js`]
    })
], DiscordApp);
exports.DiscordApp = DiscordApp;
//# sourceMappingURL=Discord.js.map