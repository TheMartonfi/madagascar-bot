"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RICO_ROOM_ID = exports.RICO_TRIGGER = exports.RICO_USER_ID = exports.BOT_TOKEN = exports.PREFIX = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PREFIX = process.env.PREFIX || "!";
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.RICO_USER_ID = process.env.RICO_USER_ID;
exports.RICO_TRIGGER = process.env.RICO_TRIGGER;
exports.RICO_ROOM_ID = process.env.RICO_ROOM_ID;
//# sourceMappingURL=settings.js.map