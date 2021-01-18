"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordCounts = exports.Memes = void 0;
const sequelize_1 = require("sequelize");
const settings_1 = require("../settings");
const basicCommands_json_1 = require("../basicCommands.json");
const sequelize = settings_1.ENV === "development"
    ? new sequelize_1.Sequelize("database", "user", "password", {
        host: "localhost",
        dialect: "sqlite",
        logging: false,
        storage: "database.sqlite"
    })
    : new sequelize_1.Sequelize(settings_1.DB_URL);
exports.Memes = sequelize.define("memes", {
    name: {
        type: sequelize_1.STRING,
        unique: true,
        allowNull: false
    },
    message: {
        type: sequelize_1.TEXT,
        allowNull: false
    }
});
exports.WordCounts = sequelize.define("word_counts", {
    word: {
        type: sequelize_1.STRING,
        unique: true
    },
    count: {
        type: sequelize_1.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});
const syncSequelize = async () => {
    await exports.Memes.sync({ force: settings_1.DB_RESET });
    await exports.WordCounts.sync({ force: settings_1.DB_RESET });
    if (settings_1.DB_RESET) {
        exports.WordCounts.create({
            word: settings_1.RICO_TRIGGER,
            count: 33
        });
        basicCommands_json_1.commands.forEach(({ name, message }) => exports.Memes.create({
            name,
            message
        }));
    }
};
syncSequelize();
//# sourceMappingURL=index.js.map