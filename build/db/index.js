"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordCounts = exports.Memes = void 0;
const sequelize_1 = require("sequelize");
const settings_1 = require("../settings");
const memeCommands_json_1 = require("../memeCommands.json");
const sequelize = new sequelize_1.Sequelize(settings_1.DB_URL, {
    logging: false
});
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
        unique: true,
        allowNull: false
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
        memeCommands_json_1.memeCommands.forEach(({ name, message }) => exports.Memes.create({
            name,
            message
        }));
    }
};
syncSequelize();
//# sourceMappingURL=index.js.map