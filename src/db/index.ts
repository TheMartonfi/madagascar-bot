import { Sequelize, Model, STRING, TEXT, INTEGER } from "sequelize";
import { ENV, DB_RESET, RICO_TRIGGER } from "../settings";
import { memeCommands } from "../memeCommands.json";

export interface Meme extends Model {
	name: string;
	message: string;
}

export interface WordCount extends Model {
	word: string;
	count: number;
}

const sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: ENV === "development" ? "devDatabase.sqlite" : "database.sqlite"
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
		unique: true
	},
	count: {
		type: INTEGER,
		defaultValue: 0,
		allowNull: false
	}
});

const syncSequelize = async () => {
	await Memes.sync({ force: DB_RESET });
	await WordCounts.sync({ force: DB_RESET });

	if (DB_RESET) {
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
