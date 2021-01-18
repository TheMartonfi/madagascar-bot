"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordApp = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const NotBot_1 = require("./guards/NotBot");
const settings_1 = require("./settings");
const db_1 = require("./db");
const commandsCollection = new discord_js_1.Collection();
const commands = [];
const getCommands = async () => {
    const memes = await db_1.Memes.findAll({ attributes: ["name", "message"] });
    memes.forEach(({ name, message }) => {
        commandsCollection.set(settings_1.PREFIX + name, message);
        commands.push({ name, message });
    });
};
const hasCommand = (message) => commandsCollection.has(message);
const getCommand = (message) => commandsCollection.get(message);
getCommands();
let DiscordApp = class DiscordApp {
    async basicCommands([{ content, channel }]) {
        const lowerCaseMessage = content.toLowerCase();
        if (!hasCommand(lowerCaseMessage))
            return;
        try {
            channel.send(getCommand(lowerCaseMessage));
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
        channel.send(commands.map(({ name }) => settings_1.PREFIX + name).join(", "));
    }
    notFoundA({ content, channel }) {
        if (hasCommand(content.toLowerCase()))
            return;
        channel.send("Command not found");
    }
};
tslib_1.__decorate([
    discord_1.On("message"),
    discord_1.Guard(NotBot_1.NotBot),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DiscordApp.prototype, "basicCommands", null);
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