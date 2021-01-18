"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemeNames = void 0;
const index_1 = require("./index");
const getMemeNames = () => {
    const memeNames = [];
    for (const [name] of index_1.memesCollection.entries()) {
        memeNames.push(name);
    }
    return memeNames;
};
exports.getMemeNames = getMemeNames;
//# sourceMappingURL=utils.js.map