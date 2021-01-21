import { Sequelize, Model, STRING, TEXT, INTEGER } from "sequelize";
import { DATABASE_URL, DB_MIGRATE, DB_SEED, RICO_TRIGGER } from "../settings";

export interface Meme extends Model {
	name: string;
	message: string;
}

export interface WordCount extends Model {
	word: string;
	count: number;
}

const sequelize = new Sequelize(DATABASE_URL, {
	logging: false
});

export const Memes = sequelize.define<Meme>("memes", {
	name: {
		type: STRING,
		unique: true,
		allowNull: false
	},
	message: {
		type: TEXT,
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

const syncSequelize = async () => {
	await Memes.sync({ force: DB_MIGRATE });
	await WordCounts.sync({ force: DB_MIGRATE });

	if (DB_SEED) {
		// Private feature
		WordCounts.create({
			word: RICO_TRIGGER,
			count: 0
		});

		// Public feature
		Memes.create({
			name: "test",
			message: "test meme"
		});

		Memes.create({
			name: "file",
			message:
				"https://cdn.discordapp.com/attachments/799012670899879986/801619938623619112/He_He_He_Yup_1.mp4"
		});
	}

	if (DB_MIGRATE || DB_SEED) process.exit();
};

syncSequelize();
