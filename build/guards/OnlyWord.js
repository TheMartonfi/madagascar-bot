"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyWord = void 0;
const OnlyWord = (word) => {
    const guard = async ([{ content }], client, next) => {
        if (content === word)
            await next();
    };
    return guard;
};
exports.OnlyWord = OnlyWord;
//# sourceMappingURL=OnlyWord.js.map