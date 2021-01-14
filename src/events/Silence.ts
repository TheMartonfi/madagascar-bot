import { On, Guard, ArgsOf } from "@typeit/discord";
import { NotBot } from "../guards/NotBot";

export abstract class Silence {
	@On("message")
	@Guard(NotBot)
	private async silence([command]: ArgsOf<"commandMessage">) {
		const wordJarRoomId = "748827509956804618";

		// Extract this check into a guard
		if (command.channel.id === wordJarRoomId) {
			const ricoId = "239891983751970824";
			const roleName = "toxic";
			const trigger = "🇳 +1";

			const role = command.guild.roles.cache.find(
				(role) => role.name === roleName
			);

			const member = command.guild.member(ricoId);
			if (command.content === trigger) member.roles.add(role);
		}
	}
}
