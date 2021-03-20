import {
	Client,
	Command,
	CommandMessage,
	Guard,
	On,
	ArgsOf
} from "@typeit/discord";
import { Message, MessageAttachment, Guild, GuildMember } from "discord.js";
import { Memes } from "../db";
import { PREFIX, PRIVATE_GUILD_ID, red } from "settings";
import { formatCommandName } from "utils";
import { NotBot } from "guards/NotBot";

export abstract class Meme {
	private makeMessageAttachment = (url: string): MessageAttachment | string => {
		return url.search("discordapp") === -1 ? url : new MessageAttachment(url);
	};

	private getMemeNames = async (guildId: string): Promise<string[]> => {
		const memes = await Memes.findAll({
			where: { guildId },
			attributes: ["name"]
		});

		return memes
			.sort((a, b) => (a.name < b.name ? -1 : 1))
			.map(({ name }) => PREFIX + name);
	};

	private isCommandName(name: string) {
		for (const { commandName } of Client.getCommands()) {
			if (commandName === name) return true;
		}

		return false;
	}

	@On("message")
	@Guard(NotBot)
	private async memeCommands(
		[{ content, channel, guild, member }]: ArgsOf<"commandMessage">,
		client: Client
	): Promise<void> {
		try {
			if (content[0] !== PREFIX) return;

			const formattedCommandName = formatCommandName(content);

			if (this.isCommandName(formattedCommandName)) return;

			// Allow users from private guild to use our guild memes everywhere
			let privateGuild: Guild;
			let privateMember: GuildMember;

			try {
				privateGuild = await client.guilds.fetch(PRIVATE_GUILD_ID);
				if (privateGuild)
					privateMember = await privateGuild.members.fetch(member.id);
			} catch (e) {
				console.log(red, e);
			}

			const meme = await Memes.findOne({
				where: {
					name: formattedCommandName,
					guildId: privateMember ? PRIVATE_GUILD_ID : guild.id
				}
			});

			if (!meme) return;

			channel.send(this.makeMessageAttachment(meme.message));
		} catch (e) {
			console.log(red, e);
		}
	}

	@Command("memes")
	private async memes(
		command: CommandMessage,
		client: Client,
		emptyObject: {},
		moreMemeNames: string[] | undefined
	): Promise<Message> {
		const { channel, guild } = command;

		const memeNames = moreMemeNames || (await this.getMemeNames(guild.id));

		if (!memeNames.length) return channel.send("No memes were found.");
		const maxCharacterCount = 2000;

		let indexToSlice: number;
		const characterCount = memeNames.reduce((acc, curr, currIndex) => {
			const count = acc + curr.length + 2;
			if (count > maxCharacterCount && !indexToSlice) indexToSlice = currIndex;

			return count;
		}, 0);

		if (characterCount < maxCharacterCount)
			return channel.send(memeNames.join(", "));

		const splitMemeNames = memeNames.slice(0, indexToSlice);
		const restMemeNames = memeNames.slice(indexToSlice);

		channel.send(splitMemeNames.join(", "));
		this.memes(command, client, emptyObject, restMemeNames);
	}

	@Command("search meme :name")
	private async searchMeme({
		channel,
		guild,
		args: { name }
	}: CommandMessage): Promise<Message> {
		if (!name) return channel.send("Please provide a search term.");

		const results: string[] = [];
		const formattedName = formatCommandName(name);

		const memeNames = await this.getMemeNames(guild.id);
		memeNames.forEach((name) => {
			if (name.search(formattedName) === -1) return;
			results.push(formatCommandName(PREFIX + name));
		});

		if (results.length > 1) {
			channel.send(`Found ${results.length} memes: ${results.join(", ")}`);
		} else if (results.length === 1) {
			const meme = await Memes.findOne({
				where: { name: results[0].slice(1), guildId: guild.id }
			});
			channel.send(this.makeMessageAttachment(meme.message));
		} else {
			channel.send("Meme not found.");
		}
	}

	@Command("add meme :name :file")
	private async addMeme({
		content,
		channel,
		guild,
		attachments,
		args: { name }
	}: CommandMessage): Promise<Message> {
		const formattedCommandName = formatCommandName(name);
		const messageAfterArgs = content.split(" ").slice(3).join(" ");

		if (this.isCommandName(formattedCommandName))
			return channel.send("Meme name cannot be a command name.");

		const attachmentUrl = attachments.first()?.url;
		const message = attachmentUrl ? attachmentUrl : messageAfterArgs;

		try {
			if (!message) return channel.send("Meme cannot be empty.");

			const memeValues = {
				name: formattedCommandName,
				guildId: guild.id
			};

			const [meme, created] = await Memes.findOrCreate({
				where: memeValues,
				defaults: {
					...memeValues,
					message
				}
			});

			if (!created) return channel.send("This meme name already exists.");

			channel.send(`Meme ${PREFIX + meme.name} successfully added.`);
		} catch (e) {
			console.log(red, e);
			channel.send(
				`There was an error adding ${PREFIX + formattedCommandName}.`
			);
		}
	}

	@Command("edit meme :oldName :newName")
	private async editMeme({
		channel,
		guild,
		args: { oldName, newName }
	}: CommandMessage): Promise<Message> {
		if (!oldName)
			return channel.send(
				"Please provide the name of the meme you want to edit."
			);
		if (!newName) return channel.send("Please provide a new name.");

		const formattedOldName = formatCommandName(oldName);
		const formattedNewName = formatCommandName(newName);

		try {
			const meme = await Memes.findOne({
				where: { name: formattedNewName, guildId: guild.id }
			});

			if (meme) return channel.send("That meme name already exists.");

			const [updateCount] = await Memes.update(
				{ name: formattedNewName },
				{ where: { name: formattedOldName, guildId: guild.id } }
			);

			if (!updateCount) return channel.send("That meme doesn't exist.");

			channel.send(
				`Successfully updated ${PREFIX + formattedOldName} to ${
					PREFIX + formattedNewName
				}.`
			);
		} catch (e) {
			console.log(red, e);
			channel.send(`There was an error updating ${PREFIX + formattedOldName}.`);
		}
	}

	@Command("delete meme :name")
	private async deleteMeme({
		channel,
		guild,
		args: { name }
	}: CommandMessage): Promise<Message> {
		if (!name) return channel.send("Please provide a name.");

		const formattedName = formatCommandName(name);
		const rowCount = await Memes.destroy({
			where: { name: formattedName, guildId: guild.id }
		});

		if (!rowCount) return channel.send("That meme didn't exist.");

		channel.send(`Meme ${PREFIX + formattedName} successfully deleted.`);
	}
}
