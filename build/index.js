"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_1 = require("@typeit/discord");
const settings_1 = require("./settings");
const start = async () => {
    const client = new discord_1.Client({
        classes: [`${__dirname}/Discord.js`],
        silent: false,
        variablesChar: ":"
    });
    await client.login(settings_1.BOT_TOKEN);
};
start();
//# sourceMappingURL=index.js.map