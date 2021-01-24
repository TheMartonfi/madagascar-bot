import { Client, Command, CommandMessage, On, ArgsOf } from "@typeit/discord";
import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import { SrcNewRunNotifs } from "../db";
import { error } from "../settings";

interface SrcResponse<T> {
	data: T[];
}

interface SrcGame {
	id: string;
	names: {
		international: string;
	};
	links: Array<{ rel: string; uri: string }>;
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
}

const src = axios.create({
	baseURL: "https://www.speedrun.com/api/v1"
});

// !src notifcations
// !delete src :gameName :categoryName

export abstract class Src {
	// I'm going to need the game name, category, runner name, pb, comment
	// Use this function to make embed need to pass params
	// return Discord Embed
	// Make getGameNameById(id: string) and getCategoryNameById(id: string)
	private makeEmbeddedSrcRun(run: SrcRun) {
		// var embed = new MessageEmbed()
		// 	 I can ignore author?
		// 	.setAuthor(pb_msg.author.name, pb_msg.author.image)
		// 	.setTitle(response.data.data.weblink)
		// 	.setDescription(pb_msg.description)
		// 	.addField(
		// 		`${plyr_name} got a ${timeStr} in ${cat_name}!`,
		// 		pb_msg.field.description
		// 	);
	}

	private async getVerifiedRuns(
		gameId: string,
		categoryId: string
	): Promise<SrcRun[]> {
		const {
			data: { data }
		} = await src.get<SrcResponse<SrcRun>>("/runs", {
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

	@On("ready")
	private async setNotifs(command: ArgsOf<"ready">, client: Client) {
		const srcNotifs = await SrcNewRunNotifs.findAll({
			attributes: [
				"id",
				"gameId",
				"categoryId",
				"lastVerifiedDate",
				"channelId"
			]
		});

		srcNotifs.forEach(
			({ id, gameId, categoryId, lastVerifiedDate, channelId }) =>
				setInterval(async () => {
					const runs = await this.getVerifiedRuns(gameId, categoryId);

					runs.forEach(async (run) => {
						const verifiedDate = Date.parse(run.status["verify-date"]);

						if (verifiedDate > lastVerifiedDate) {
							await SrcNewRunNotifs.update(
								{ lastVerifiedDate: verifiedDate },
								{ where: { id } }
							);

							const channel = await client.channels.fetch(channelId);
							// @ts-ignore
							channel.send(this.makeEmbeddedSrcRun(run));
						}
					});
				}, 60000)
		);
	}

	@Command("add src :abbreviation :categoryName")
	private async addNotif(
		{ channel, guild, args: { abbreviation, categoryName } }: CommandMessage,
		client: Client
	): Promise<Message> {
		if (!abbreviation)
			return channel.send("Please provide a game abbreviation.");

		const {
			data: {
				data: [game]
			}
		} = await src.get<SrcResponse<SrcGame>>("/games", {
			params: { abbreviation }
		});

		if (!game)
			return channel.send(
				"The abbreviation you submitted returned no results."
			);

		const { uri } = game.links.find((link) => link.rel === "categories");
		const {
			data: { data }
		} = await axios.get<SrcResponse<SrcCategory>>(uri);

		const category = data.find(
			(srcCategory) =>
				srcCategory.name.toLowerCase() === categoryName?.toLowerCase()
		);

		const [lastVerifiedRun] = await this.getVerifiedRuns(game.id, category?.id);

		try {
			await SrcNewRunNotifs.create({
				gameId: game.id,
				categoryId: category?.id,
				channelId: channel.id,
				guildId: guild.id,
				lastVerifiedDate: Date.parse(lastVerifiedRun.status["verify-date"])
			});

			client.emit("ready");

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
