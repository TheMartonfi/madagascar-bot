import Sequelize from "sequelize";
import { DB_RESET, RICO_TRIGGER } from "../settings";

// @ts-ignore
const sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite"
});

export const Memes = sequelize.define("memes", {
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	message: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

export const WordCounts = sequelize.define("word_counts", {
	word: {
		type: Sequelize.STRING,
		unique: true
	},
	count: {
		type: Sequelize.INTEGER,
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
			count: 0
		});
	}
};

syncSequelize();
