"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RICO_ROOM_ID = exports.RICO_TRIGGER = exports.RICO_USER_ID = exports.BOT_TOKEN = exports.PREFIX = exports.DB_RESET = exports.DB_URL = exports.ENV = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = process.env.ENV;
exports.DB_URL = process.env.DB_URL;
exports.DB_RESET = process.env.DB_RESET || false;
exports.PREFIX = process.env.PREFIX || "!";
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.RICO_USER_ID = process.env.RICO_USER_ID;
exports.RICO_TRIGGER = process.env.RICO_TRIGGER;
exports.RICO_ROOM_ID = process.env.RICO_ROOM_ID;
//# sourceMappingURL=settings.js.map