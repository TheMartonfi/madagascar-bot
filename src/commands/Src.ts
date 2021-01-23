import { Client, Command, CommandMessage, On, ArgsOf } from "@typeit/discord";

export abstract class Src {
	@On("ready")
	private async setNotifs(command: ArgsOf<"ready">, client: Client) {
		// const channel = await client.channels.fetch("801671598842445844");
		// // @ts-ignore
		// channel.send("Mornin");
	}

	@Command("add src :game :category?")
	private async addNotif({
		channel,
		args: { game, category }
	}: CommandMessage): Promise<void> {
		// console.log("hello");
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
