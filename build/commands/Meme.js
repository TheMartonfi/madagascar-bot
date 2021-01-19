"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meme = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const settings_1 = require("../settings");
const OnlyGuild_1 = require("../guards/OnlyGuild");
const index_1 = require("../index");
const utils_1 = require("../utils");
const db_1 = require("../db");
class Meme {
    searchMeme({ channel, args: { word } }) {
        const results = [];
        utils_1.getMemeNames().forEach((name) => {
            if (name.search(utils_1.formatCommandName(word)) === -1)
                return;
            results.push(name);
        });
        // Use new function to send message attachment
        return results.length
            ? results.length === 1
                ? channel.send(new discord_js_1.MessageAttachment(index_1.memesCollection.get(results[0])))
                : channel.send(`Found ${results.length} memes: ${results.join(", ")}.`)
            : channel.send("Meme not found.");
    }
    async addMeme({ channel, attachments, args: { name } }) {
        var _a;
        const formattedName = utils_1.formatCommandName(name);
        const message = (_a = attachments.first()) === null || _a === void 0 ? void 0 : _a.url;
        try {
            const meme = await db_1.Memes.create({ name: formattedName, message });
            channel.send(`Meme ${meme.name} successfully added.`);
        }
        catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
                channel.send("That meme already exists.");
            }
            else {
                channel.send(`There was an error adding ${formattedName}.`);
                console.log(e);
            }
        }
    }
    async editMeme({ channel, args: { id, name } }) {
        const formattedId = utils_1.formatCommandName(id);
        const formattedName = utils_1.formatCommandName(name);
        try {
            await db_1.Memes.update({ name: formattedName }, { where: { name: formattedId } });
            channel.send(`Successfully updated ${formattedName}.`);
        }
        catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
                channel.send("That meme already exists.");
            }
            else {
                channel.send(`There was an error updating ${formattedId}.`);
                console.log(e);
            }
        }
    }
    async deleteMeme({ channel, args: { name } }) {
        const formattedName = utils_1.formatCommandName(name);
        const rowCount = await db_1.Memes.destroy({ where: { name: formattedName } });
        if (!rowCount)
            return channel.send("That meme didn't exist.");
        return channel.send(`Meme ${formattedName} succesfully deleted.`);
    }
}
tslib_1.__decorate([
    discord_1.Command("search meme :word"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "searchMeme", null);
tslib_1.__decorate([
    discord_1.Command("add meme :name"),
    discord_1.Guard(OnlyGuild_1.OnlyGuild(settings_1.MADAGASCAR_GUILD_ID)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "addMeme", null);
tslib_1.__decorate([
    discord_1.Command("edit meme :id :name"),
    discord_1.Guard(OnlyGuild_1.OnlyGuild(settings_1.MADAGASCAR_GUILD_ID)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "editMeme", null);
tslib_1.__decorate([
    discord_1.Command("delete meme :name"),
    discord_1.Guard(OnlyGuild_1.OnlyGuild(settings_1.MADAGASCAR_GUILD_ID)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "deleteMeme", null);
exports.Meme = Meme;
//# sourceMappingURL=Meme.js.map