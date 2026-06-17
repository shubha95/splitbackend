"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_service_1 = require("../auth/auth.service");
const chat_service_1 = require("./chat.service");
const presence_service_1 = require("./presence.service");
const chat_events_1 = require("./chat.events");
let ChatGateway = class ChatGateway {
    constructor(authService, chatService, presenceService) {
        this.authService = authService;
        this.chatService = chatService;
        this.presenceService = presenceService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token;
            if (!token)
                throw new Error('No token');
            const user = await this.authService.verifyToken(token);
            client.data.user = user;
            const justCameOnline = this.presenceService.add(user.id, client.id);
            if (justCameOnline) {
                this.server.emit(chat_events_1.ChatEvent.PRESENCE, { userId: user.id, status: 'online' });
            }
        }
        catch {
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const user = client.data?.user;
        if (!user)
            return;
        const justWentOffline = this.presenceService.remove(user.id, client.id);
        if (justWentOffline) {
            this.server.emit(chat_events_1.ChatEvent.PRESENCE, { userId: user.id, status: 'offline' });
        }
    }
    async handleJoinRoom(client, payload) {
        const user = client.data?.user;
        if (!user) {
            client.disconnect();
            return;
        }
        const conv = await this.chatService.findConversationForUser(user.id, payload.conversationId);
        if (!conv) {
            client.emit('error', { message: 'Conversation not found or access denied' });
            return;
        }
        await client.join(payload.conversationId);
    }
    async handleSendMessage(client, payload) {
        const user = client.data?.user;
        if (!user) {
            client.disconnect();
            return;
        }
        try {
            const message = await this.chatService.saveMessage(user.id, {
                conversationId: payload.conversationId,
                type: payload.type,
                encryptedForReceiver: payload.encryptedForReceiver,
                encryptedForSender: payload.encryptedForSender,
                nonce: payload.nonce,
                encryptionVersion: payload.encryptionVersion,
            });
            this.server.to(payload.conversationId).emit(chat_events_1.ChatEvent.NEW_MESSAGE, message);
        }
        catch (err) {
            client.emit('error', { message: err.message ?? 'Failed to send message' });
        }
    }
    handleTyping(client, payload) {
        const user = client.data?.user;
        if (!user)
            return;
        client.to(payload.conversationId).emit(chat_events_1.ChatEvent.USER_TYPING, {
            conversationId: payload.conversationId,
            userId: user.id,
        });
    }
    async handleReadReceipt(client, payload) {
        const user = client.data?.user;
        if (!user)
            return;
        await this.chatService.markRead(user.id, payload.messageId);
        this.server.to(payload.conversationId).emit(chat_events_1.ChatEvent.MESSAGE_READ, {
            messageId: payload.messageId,
            userId: user.id,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(chat_events_1.ChatEvent.JOIN_ROOM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(chat_events_1.ChatEvent.SEND_MESSAGE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(chat_events_1.ChatEvent.TYPING),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(chat_events_1.ChatEvent.READ_RECEIPT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleReadReceipt", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, namespace: 'chat' }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        chat_service_1.ChatService,
        presence_service_1.PresenceService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map