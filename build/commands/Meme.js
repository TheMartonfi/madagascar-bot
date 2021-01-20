"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meme = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const db_1 = require("../db");
const settings_1 = require("../settings");
const OnlyGuild_1 = require("../guards/OnlyGuild");
const utils_1 = require("../utils");
class Meme {
    async searchMeme({ channel, args: { name } }) {
        const results = [];
        const formattedName = utils_1.formatCommandName(name);
        const memeNames = await utils_1.getMemeNames();
        memeNames.forEach((name) => {
            if (name.search(formattedName) === -1)
                return;
            results.push(name);
        });
        if (results.length > 1) {
            channel.send(`Found ${results.length} memes: ${results.join(", ")}`);
        }
        else if (results.length === 1) {
            const meme = await db_1.Memes.findOne({ where: { name: formattedName } });
            channel.send(utils_1.makeMessageAttachment(meme.message));
        }
        else {
            channel.send("Meme not found.");
        }
    }
    async addMeme({ channel, attachments, args: { name, file } }) {
        const formattedName = utils_1.formatCommandName(name);
        const attachmentUrl = attachments.first().url;
        const message = attachmentUrl ? attachmentUrl : file;
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
    async editMeme({ channel, args: { oldName, newName } }) {
        const formattedOldName = utils_1.formatCommandName(oldName);
        const formattedNewName = utils_1.formatCommandName(newName);
        try {
            await db_1.Memes.update({ name: formattedNewName }, { where: { name: formattedOldName } });
            channel.send(`Successfully updated ${formattedOldName} to ${formattedNewName}.`);
        }
        catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
                channel.send("That meme already exists.");
            }
            else {
                channel.send(`There was an error updating ${formattedOldName}.`);
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
    discord_1.Command("search meme :name"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "searchMeme", null);
tslib_1.__decorate([
    discord_1.Command("add meme :name :file"),
    discord_1.Guard(OnlyGuild_1.OnlyGuild(settings_1.MADAGASCAR_GUILD_ID)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", Promise)
], Meme.prototype, "addMeme", null);
tslib_1.__decorate([
    discord_1.Command("edit meme :oldName :newName"),
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