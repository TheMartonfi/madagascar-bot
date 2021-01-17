"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
class Help {
    help({ channel }) {
        channel.send("No");
    }
}
tslib_1.__decorate([
    discord_1.Command("help"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_1.CommandMessage]),
    tslib_1.__metadata("design:returntype", void 0)
], Help.prototype, "help", null);
exports.Help = Help;
//# sourceMappingURL=Help.js.map