"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordCounts = exports.Memes = void 0;
const tslib_1 = require("tslib");
const sequelize_1 = tslib_1.__importDefault(require("sequelize"));
const settings_1 = require("../settings");
// @ts-ignore
const sequelize = new sequelize_1.default("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite"
});
exports.Memes = sequelize.define("memes", {
    name: {
        type: sequelize_1.default.STRING,
        unique: true,
        allowNull: false
    },
    message: {
        type: sequelize_1.default.TEXT,
        allowNull: false
    }
});
exports.WordCounts = sequelize.define("word_counts", {
    word: {
        type: sequelize_1.default.STRING,
        unique: true
    },
    count: {
        type: sequelize_1.default.INTEGER,
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
            count: 0
        });
    }
};
syncSequelize();
//# sourceMappingURL=index.js.map