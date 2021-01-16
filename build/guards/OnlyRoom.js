"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyRoom = void 0;
const OnlyRoom = (roomId) => {
    const guard = async ([{ channel }], client, next) => {
        if (channel.id === roomId)
            await next();
    };
    return guard;
};
exports.OnlyRoom = OnlyRoom;
//# sourceMappingURL=OnlyRoom.js.map