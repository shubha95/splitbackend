"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceService = void 0;
const common_1 = require("@nestjs/common");
let PresenceService = class PresenceService {
    constructor() {
        this.sockets = new Map();
    }
    add(userId, socketId) {
        if (!this.sockets.has(userId))
            this.sockets.set(userId, new Set());
        const set = this.sockets.get(userId);
        const wasOffline = set.size === 0;
        set.add(socketId);
        return wasOffline;
    }
    remove(userId, socketId) {
        const set = this.sockets.get(userId);
        if (!set)
            return false;
        set.delete(socketId);
        if (set.size === 0)
            this.sockets.delete(userId);
        return set.size === 0;
    }
    isOnline(userId) {
        return (this.sockets.get(userId)?.size ?? 0) > 0;
    }
};
exports.PresenceService = PresenceService;
exports.PresenceService = PresenceService = __decorate([
    (0, common_1.Injectable)()
], PresenceService);
//# sourceMappingURL=presence.service.js.map