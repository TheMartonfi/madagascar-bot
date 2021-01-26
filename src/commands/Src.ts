import {
	Client,
	Command,
	CommandMessage,
	Guard,
	On,
	ArgsOf
} from "@typeit/discord";
import axios from "axios";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { OnlyGuildOwner } from "../guards/OnlyGuildOwner";
import { SrcNewRunNotifs } from "../db";
import { error } from "../settings";

interface SrcResponse<T> {
	data: T;
}

interface SrcGame {
	id: string;
	names: {
		international: string;
	};
	links: Array<{ rel: string; uri: string }>;
	assets: { "cover-tiny": { uri: string } };
}

interface SrcCategory {
	id: string;
	name: string;
}

interface SrcRun {
	weblink: string;
	category: string;
	comment: string;
	status: {
		"verify-date": string;
	};
	players: Array<{ uri: string }>;
	times: { realtime_t: number };
	links: Array<{ rel: string; uri: string }>;
}

interface SrcPlayer {
	names: {
		international: string;
	};
}

const src = axios.create({
	baseURL: "https://www.speedrun.com/api/v1"
});

export abstract class Src {
	private async makeEmbeddedSrcRun({
		players: [player],
		times,
		links,
		weblink,
		comment
	}: SrcRun): Promise<MessageEmbed> {
		const playerData = await axios.get<SrcResponse<SrcPlayer>>(player.uri);
		const playerName = playerData.data.data.names.international;

		const game = links.find((link) => link.rel === "game");
		const gameData = await axios.get<SrcResponse<SrcGame>>(game.uri);
		const gameName = gameData.data.data.names.international;
		const gameIconUrl = gameData.data.data.assets["cover-tiny"].uri;

		const category = links.find((link) => link.rel === "category");
		const categoryData = await axios.get<SrcResponse<SrcCategory>>(
			category.uri
		);
		const categoryName = categoryData.data.data.name;

		const time = new Date(times["realtime_t"] * 1000)
			.toISOString()
			.substr(11, 8);

		return new MessageEmbed()
			.setAuthor("Speedrun.com", gameIconUrl)
			.setTitle(`${playerName} got a ${time} in ${gameName} ${categoryName}!`)
			.setDescription(weblink)
			.setFooter(`Run Comment: ${comment}`);
	}

	private async getVerifiedRuns(
		gameId: string,
		categoryId: string | undefined
	): Promise<SrcRun[]> {
		const {
			data: { data }
		} = await src.get<SrcResponse<SrcRun[]>>("/runs", {
			params: {
				game: gameId,
				category: categoryId,
				status: "verified",
				orderby: "verify-date",
				direction: "desc"
			}
		});

		return data;
	}

	private getCategoryName(content: string): string {
		return content.split(" ").slice(3).join(" ").toLowerCase();
	}

	private intervals: NodeJS.Timeout[] = [];

	@On("ready")
	private async setSrcNotifs(
		command: ArgsOf<"ready">,
		client: Client
	): Promise<void> {
		const srcNotifs = await SrcNewRunNotifs.findAll({
			attributes: [
				"id",
				"gameId",
				"categoryId",
				"lastVerifiedDate",
				"channelId"
			]
		});

		this.intervals.forEach((interval) => {
			clearInterval(interval);
			this.intervals.shift();
		});

		srcNotifs.forEach(
			({ id, gameId, categoryId, channelId, lastVerifiedDate }) =>
				this.intervals.push(
					setInterval(async () => {
						const runs = await this.getVerifiedRuns(gameId, categoryId);

						runs.reverse().forEach(async (run) => {
							const verifiedDate = Date.parse(run.status["verify-date"]);

							if (verifiedDate > lastVerifiedDate) {
								await SrcNewRunNotifs.update(
									{ lastVerifiedDate: verifiedDate },
									{ where: { id } }
								);

								const channel = (await client.channels.fetch(
									channelId
								)) as TextChannel;

								const message = await this.makeEmbeddedSrcRun(run);
								channel.send(message);
								this.setSrcNotifs(null, client);
							}
						});
					}, 60000)
				)
		);
	}

	@Command("notifications")
	private async notifications({
		channel,
		guild
	}: CommandMessage): Promise<Message> {
		const allNotifications = await SrcNewRunNotifs.findAll({
			where: { guildId: guild.id }
		});

		if (allNotifications.length)
			return channel.send(
				allNotifications
					.map(
						(notification) =>
							`${notification.abbreviation}${
								notification?.categoryName
									? ` ${notification.categoryName}`
									: ""
							}`
					)
					.join(", ")
			);

		channel.send("There are no src notifications.");
	}

	@Command("add src :abbreviation :categoryName")
	@Guard(OnlyGuildOwner)
	private async addSrcNotif(
		{ content, channel, guild, args: { abbreviation } }: CommandMessage,
		client: Client
	): Promise<Message> {
		if (!abbreviation)
			return channel.send("Please provide a game abbreviation.");

		const {
			data: {
				data: [game]
			}
		} = await src.get<SrcResponse<SrcGame[]>>("/games", {
			params: { abbreviation }
		});

		if (!game)
			return channel.send(
				"The abbreviation you submitted returned no results."
			);

		const srcNotif = await SrcNewRunNotifs.findOne({
			where: { abbreviation, categoryName: "", guildId: guild.id }
		});

		if (srcNotif)
			return channel.send(
				"You are already getting notifications for all categories."
			);

		const srcNotifs = await SrcNewRunNotifs.findAll({
			where: { abbreviation, guildId: guild.id }
		});

		if (srcNotifs.length)
			return channel.send(
				"You must remove all other notifications for this game before adding all categories."
			);

		const { uri } = game.links.find((link) => link.rel === "categories");
		const categoryData = await axios.get<SrcResponse<SrcCategory[]>>(uri);
		const categoryName = this.getCategoryName(content);

		const category = categoryData.data.data.find(
			(srcCategory) => srcCategory.name.toLowerCase() === categoryName
		);

		const [lastVerifiedRun] = await this.getVerifiedRuns(game.id, category?.id);

		try {
			const [srcNotif, created] = await SrcNewRunNotifs.findOrCreate({
				where: {
					gameId: game.id,
					categoryId: category?.id ? category.id : "",
					abbreviation,
					categoryName,
					channelId: channel.id,
					guildId: guild.id,
					lastVerifiedDate: Date.parse(lastVerifiedRun.status["verify-date"])
				}
			});

			if (!created)
				return channel.send("That src notification already exists.");

			await this.setSrcNotifs(null, client);

			channel.send(
				`Succesfully added src notfications for ${abbreviation}${
					category ? ` ${categoryName}` : ""
				} in channel ${channel.type === "text" && channel.name}.`
			);
		} catch (e) {
			console.log(error(e));
			channel.send("Something went wrong adding your src notification.");
		}
	}

	@Command("delete src :abbreviation :categoryName")
	@Guard(OnlyGuildOwner)
	private async deleteSrcNotif({
		content,
		channel,
		guild,
		args: { abbreviation }
	}: CommandMessage) {
		if (!abbreviation) return channel.send("Please provide an abbreviation.");

		const categoryName = this.getCategoryName(content);
		const srcNotif = await SrcNewRunNotifs.findOne({
			where: { abbreviation, categoryName, guildId: guild.id }
		});

		if (!srcNotif) return channel.send("That src notification doesn't exist.");

		await SrcNewRunNotifs.destroy({
			where: { id: srcNotif.id }
		});

		channel.send(
			`Successfully deleted notfication for ${srcNotif.abbreviation}${
				categoryName ? ` ${srcNotif.categoryName}` : ""
			}.`
		);
	}
}
