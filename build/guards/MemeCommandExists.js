"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemeCommandExists = void 0;
const index_1 = require("../index");
const MemeCommandExists = async ([{ content }], client, next) => index_1.memesCollection.has(content.toLowerCase()) && (await next());
exports.MemeCommandExists = MemeCommandExists;
//# sourceMappingURL=MemeCommandExists.js.map