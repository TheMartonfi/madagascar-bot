"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const tslib_1 = require("tslib");
const sequelize_1 = tslib_1.__importDefault(require("sequelize"));
// @ts-ignore
exports.sequelize = new sequelize_1.default("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: true,
    storage: "database.sqlite"
});
const Memes = exports.sequelize.define("tags", {
    name: {
        type: sequelize_1.default.STRING,
        unique: true
    },
    message: sequelize_1.default.TEXT
});
Memes.sync();
//# sourceMappingURL=Sequelize.js.map