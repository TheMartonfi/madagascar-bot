"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const discord_1 = require("@typeit/discord");
dotenv_1.default.config();
const { TOKEN } = process.env;
const start = async () => {
    const client = new discord_1.Client({
        classes: [`${__dirname}/Discord.js`],
        silent: false,
        variablesChar: ":"
    });
    if (typeof TOKEN === "string")
        await client.login(TOKEN);
};
start();
//# sourceMappingURL=index.js.map