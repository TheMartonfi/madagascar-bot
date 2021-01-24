import { Client, Command, CommandMessage, On, ArgsOf } from "@typeit/discord";
import axios from "axios";
import { Message } from "discord.js";
import { SrcNewRunNotifs } from "../db";
import { error } from "../settings";

const src = axios.create({
	baseURL: "https://www.speedrun.com/api/v1"
});

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

export abstract class Src {
	@On("ready")
	private async setNotifs(command: ArgsOf<"ready">, client: Client) {
		// const channel = await client.channels.fetch("801671598842445844");
		// // @ts-ignore
		// channel.send("Mornin");
		const allNotifs = await SrcNewRunNotifs.findAll({
			attributes: [
				"gameName",
				"gameId",
				"categoryId",
				"lastVerifiedDate",
				"channelId",
				"guildId"
			]
		});

		allNotifs.forEach(
			async (notif) => {
				// setInterval(async () => {
				const newRuns = await src.get("/runs", {
					params: { game: notif.gameId, category: notif.categoryId }
				});

				console.log(newRuns);
			}
			// }, 1000)
		);
	}

	@Command("add src :abbreviation :categoryName")
	private async addNotif({
		channel,
		guild,
		args: { abbreviation, categoryName }
	}: CommandMessage): Promise<Message> {
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

		const gameName = game.names.international;
		const category = data.find(
			(srcCategory) =>
				srcCategory.name.toLowerCase() === categoryName.toLowerCase()
		);
		const successMessage = `Succesfully added src notfications for ${gameName}`;
		try {
			await SrcNewRunNotifs.create({
				gameName,
				gameId: game.id,
				categoryId: category.id,
				channelId: channel.id,
				guildId: guild.id
			});
			channel.send(
				category ? `${successMessage} ${category.name}.` : `${successMessage}.`
			);
		} catch (e) {
			console.log(error(e));
			channel.send("Something went wrong adding your src notification.");
		}
	}
}

//!add src :abbreviation :category?
// const { data: [game] } = get https://www.speedrun.com/api/v1/games?abbreviation=${abbreviation}
// add guildId so you can list all notifs for a server?
// srcNewRunNotifs.create({ gameId: game.id, channelId: command.channel.id });

// const notifs = srcNewRunNotifs.fetchAll({ attributes: ["gameId", "channelId"] })

// notifs.forEach((notif) => {
// setInterval(() => {
// https://www.speedrun.com/api/v1/runs?game=${game.id}&status=new

// If I know the last run posted I can run checks before sending messages
// find run with id?
// splice after that run?

// }, 900000)
// })

// setInterval(async () => {
// 	const {
// 		data: { data }
// 	} = await axios.get(
// 		`https://www.speedrun.com/api/v1/runs?game=9dokge1p&status=new`
// 	);
// 	console.log(data);
// }, 10000);

// src_new_run_notifs
// gameId: string; channelId: string; lastRunId: string; categoryId?: string;
