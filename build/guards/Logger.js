"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const Logger = async ([message], client, next) => {
    console.log(message);
    await next();
};
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map