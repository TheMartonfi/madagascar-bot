"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyRoom = void 0;
const OnlyRoom = (roomId) => {
    const guard = async ([message], client, next) => {
        if (message.channel.id === roomId)
            await next();
    };
    return guard;
};
exports.OnlyRoom = OnlyRoom;
//# sourceMappingURL=OnlyRoom.js.map