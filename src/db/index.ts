import { Sequelize, Model, STRING, TEXT, INTEGER, BIGINT } from "sequelize";
import {
	yellow,
	ENV,
	DATABASE_URL,
	DB_MIGRATE,
	DB_SEED,
	DB_RESET,
	RICO_TRIGGER,
	PRIVATE_GUILD_ID
} from "settings";

export interface Meme extends Model {
	id: number;
	name: string;
	message: string;
	guildId: string;
}

export interface WordCount extends Model {
	id: number;
	word: string;
	count: number;
}

export interface SrcNewRunNotif extends Model {
	id: number;
	gameId: string;
	categoryId?: string;
	abbreviation: string;
	categoryName?: string;
	lastVerifiedDate: number;
	channelId: string;
	guildId: string;
}

const devParams = {
	logging: (query: string) => console.log(yellow, query)
};

const prodParams = {
	...devParams,
	dialect: "postgres",
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	}
};

const sequelize = new Sequelize(
	DATABASE_URL,
	ENV === "development" ? devParams : prodParams
);

export const Memes = sequelize.define<Meme>("memes", {
	name: {
		type: STRING,
		allowNull: false
	},
	message: {
		type: TEXT,
		allowNull: false
	},
	guildId: {
		type: STRING,
		allowNull: false
	}
});

export const WordCounts = sequelize.define<WordCount>("word_counts", {
	word: {
		type: STRING,
		unique: true,
		allowNull: false
	},
	count: {
		type: INTEGER,
		defaultValue: 0,
		allowNull: false
	}
});

export const SrcNewRunNotifs = sequelize.define<SrcNewRunNotif>(
	"src_new_run_notifs",
	{
		gameId: {
			type: STRING,
			allowNull: false
		},
		categoryId: {
			type: STRING
		},
		abbreviation: {
			type: STRING,
			allowNull: false
		},
		categoryName: {
			type: STRING
		},
		lastVerifiedDate: {
			type: BIGINT,
			allowNull: false
		},
		channelId: {
			type: STRING,
			allowNull: false
		},
		guildId: {
			type: STRING,
			allowNull: false
		}
	}
);

const syncSequelize = async () => {
	await sequelize.sync({ alter: DB_MIGRATE, force: DB_RESET });

	if (DB_SEED || DB_RESET) {
		// Private feature
		await WordCounts.create({
			word: RICO_TRIGGER,
			count: 0
		});

		// Public feature
		await Memes.create({
			name: "test",
			message: "test meme",
			guildId: PRIVATE_GUILD_ID
		});

		await Memes.create({
			name: "file",
			message:
				"https://cdn.discordapp.com/attachments/799012670899879986/801619938623619112/He_He_He_Yup_1.mp4",
			guildId: PRIVATE_GUILD_ID
		});
	}

	if (DB_MIGRATE || DB_SEED || DB_RESET) process.exit();
};

syncSequelize();
