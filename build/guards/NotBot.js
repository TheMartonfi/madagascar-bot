"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotBot = void 0;
const NotBot = async ([message], client, next) => client.user.id !== message.author.id && (await next());
exports.NotBot = NotBot;
//# sourceMappingURL=NotBot.js.map