import {
	Client,
	Command,
	CommandMessage,
	Guard,
	On,
	ArgsOf
} from "@typeit/discord";
import { Message, MessageAttachment } from "discord.js";
import { Memes } from "../db";
import { PREFIX, PRIVATE_GUILD_ID, error } from "../settings";
import { formatCommandName } from "../utils";
import { OnlyGuild } from "../guards/OnlyGuild";
import { NotBot } from "../guards/NotBot";

export abstract class Meme {
	private makeMessageAttachment = (url: string): MessageAttachment | string => {
		return url.search("discordapp") === -1 ? url : new MessageAttachment(url);
	};

	private getMemeNames = async (): Promise<string[]> => {
		const memes = await Memes.findAll({ attributes: ["name"] });
		return memes.map(({ name }) => PREFIX + name);
	};

	@On("message")
	@Guard(NotBot)
	private async memeCommands([
		{ content, channel }
	]: ArgsOf<"commandMessage">): Promise<void> {
		try {
			if (content[0] !== PREFIX) return;

			const formattedCommandName = formatCommandName(content);

			for (const { commandName } of Client.getCommands()) {
				if (formattedCommandName === commandName) return;
			}

			const meme = await Memes.findOne({
				where: { name: formattedCommandName }
			});

			if (!meme) return;

			channel.send(this.makeMessageAttachment(meme.message));
		} catch (e) {
			console.log(error(e));
		}
	}

	@Command("memes")
	private async memes({ channel }: CommandMessage): Promise<Message> {
		const memeNames = await this.getMemeNames();

		if (memeNames.length) return channel.send(memeNames.join(", "));
		channel.send("No memes were found.");
	}

	@Command("search meme :name")
	private async searchMeme({
		channel,
		args: { name }
	}: CommandMessage): Promise<void> {
		const results: string[] = [];
		const formattedName = formatCommandName(name);

		const memeNames = await this.getMemeNames();
		memeNames.forEach((name) => {
			if (name.search(formattedName) === -1) return;
			results.push(formatCommandName(PREFIX + name));
		});

		if (results.length > 1) {
			channel.send(`Found ${results.length} memes: ${results.join(", ")}`);
		} else if (results.length === 1) {
			const meme = await Memes.findOne({ where: { name: results[0] } });
			channel.send(this.makeMessageAttachment(meme.message));
		} else {
			channel.send("Meme not found.");
		}
	}

	@Command("add meme :name :file")
	@Guard(OnlyGuild(PRIVATE_GUILD_ID))
	private async addMeme({
		content,
		channel,
		attachments,
		args: { name }
	}: CommandMessage): Promise<Message> {
		const formattedName = formatCommandName(name);
		const messageAfterArgs = content.split(" ").slice(3).join(" ");

		for (const { commandName } of Client.getCommands()) {
			if (commandName === formattedName)
				return channel.send("Meme name cannot be a command name.");
		}

		const attachmentUrl = attachments.first()?.url;
		const message = attachmentUrl ? attachmentUrl : messageAfterArgs;

		try {
			if (!message) return channel.send("Meme cannot be empty.");

			const meme = await Memes.create({ name: formattedName, message });
			channel.send(`Meme ${PREFIX + meme.name} successfully added.`);
		} catch (e) {
			if (e.name === "SequelizeUniqueConstraintError") {
				channel.send("That meme name already exists.");
			} else {
				channel.send(`There was an error adding ${PREFIX + formattedName}.`);
				console.log(error(e));
			}
		}
	}

	@Command("edit meme :oldName :newName")
	@Guard(OnlyGuild(PRIVATE_GUILD_ID))
	private async editMeme({
		channel,
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
			const [updateCount] = await Memes.update(
				{ name: formattedNewName },
				{ where: { name: formattedOldName } }
			);

			if (updateCount)
				return channel.send(
					`Successfully updated ${PREFIX + formattedOldName} to ${
						PREFIX + formattedNewName
					}.`
				);

			channel.send("That meme doesn't exist.");
		} catch (e) {
			if (e.name === "SequelizeUniqueConstraintError") {
				channel.send("That meme already exists.");
			} else {
				channel.send(
					`There was an error updating ${PREFIX + formattedOldName}.`
				);
				console.log(error(e));
			}
		}
	}

	@Command("delete meme :name")
	@Guard(OnlyGuild(PRIVATE_GUILD_ID))
	private async deleteMeme({
		channel,
		args: { name }
	}: CommandMessage): Promise<Message> {
		if (!name) return channel.send("Please provide a name.");

		const formattedName = formatCommandName(name);
		const rowCount = await Memes.destroy({ where: { name: formattedName } });
		if (!rowCount) return channel.send("That meme didn't exist.");

		return channel.send(`Meme ${PREFIX + formattedName} successfully deleted.`);
	}
}
