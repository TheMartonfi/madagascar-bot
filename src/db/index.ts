import { Sequelize, Model, STRING, TEXT, INTEGER } from "sequelize";
import { DATABASE_URL, DB_MIGRATE, DB_SEED, RICO_TRIGGER } from "../settings";
import { memeCommands } from "../memes.json";

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
		WordCounts.create({
			word: RICO_TRIGGER,
			count: 33
		});

		memeCommands.forEach(({ name, message }) =>
			Memes.create({
				name,
				message
			})
		);
	}
};

syncSequelize();
