import {
	Client,
	Command,
	CommandMessage,
	Guard,
	On,
	ArgsOf
} from "@typeit/discord";
import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
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

// !src notifcations
// !delete src :gameName :categoryName

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

		srcNotifs.map(({ id, gameId, categoryId, channelId, lastVerifiedDate }) =>
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

							const channel = await client.channels.fetch(channelId);
							const message = await this.makeEmbeddedSrcRun(run);
							// @ts-ignore
							channel.send(message);
							this.setSrcNotifs(command, client);
						}
					});
				}, 60000)
			)
		);
	}

	@Command("add src :abbreviation :categoryName")
	@Guard(OnlyGuildOwner)
	private async addSrcNotif(
		{
			content,
			channel,
			guild,
			args: { abbreviation, categoryName }
		}: CommandMessage,
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

		const { uri } = game.links.find((link) => link.rel === "categories");
		const categoryData = await axios.get<SrcResponse<SrcCategory[]>>(uri);
		const messageAfterArgs = content
			.split(" ")
			.slice(3)
			.join(" ")
			.toLowerCase();
		const category = categoryData.data.data.find(
			(srcCategory) => srcCategory.name.toLowerCase() === messageAfterArgs
		);

		const [lastVerifiedRun] = await this.getVerifiedRuns(game.id, category?.id);

		try {
			await SrcNewRunNotifs.create({
				gameId: game.id,
				categoryId: category?.id,
				channelId: channel.id,
				guildId: guild.id,
				lastVerifiedDate: Date.parse(lastVerifiedRun.status["verify-date"])
				// lastVerifiedDate: Date.parse("2021-01-23T12:12:12Z")
			});

			await this.setSrcNotifs(null, client);

			console.log(typeof channel);
			channel.send(
				`Succesfully added src notfications for ${game.names.international}${
					category ? ` ${category.name}` : ""
					// @ts-ignore
				} in channel ${channel.name}.`
			);
		} catch (e) {
			console.log(error(e));
			channel.send("Something went wrong adding your src notification.");
		}
	}
}
