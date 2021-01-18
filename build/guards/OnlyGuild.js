"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyGuild = void 0;
const OnlyGuild = (guildId) => {
    const guard = async ([{ guild }], client, next) => {
        if (guild.id === guildId)
            await next();
    };
    return guard;
};
exports.OnlyGuild = OnlyGuild;
//# sourceMappingURL=OnlyGuild.js.map