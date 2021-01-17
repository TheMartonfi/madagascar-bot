import Sequelize from "sequelize";

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

Memes.sync();
WordCounts.sync();
