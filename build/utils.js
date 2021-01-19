"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCommandName = exports.getMemeNames = void 0;
const index_1 = require("./index");
const settings_1 = require("./settings");
const getMemeNames = () => {
    const memeNames = [];
    for (const [name] of index_1.memesCollection.entries()) {
        memeNames.push(name);
    }
    return memeNames;
};
exports.getMemeNames = getMemeNames;
const formatCommandName = (name) => {
    if (name[0] === settings_1.PREFIX)
        name = name.slice(1);
    return name.toLowerCase();
};
exports.formatCommandName = formatCommandName;
//# sourceMappingURL=utils.js.map