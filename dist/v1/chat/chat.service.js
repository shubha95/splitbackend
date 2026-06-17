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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const conversation_schema_1 = require("../../schemas/conversation.schema");
const message_schema_1 = require("../../schemas/message.schema");
const group_member_schema_1 = require("../../schemas/group-member.schema");
let ChatService = class ChatService {
    constructor(conversationModel, messageModel, groupMemberModel) {
        this.conversationModel = conversationModel;
        this.messageModel = messageModel;
        this.groupMemberModel = groupMemberModel;
    }
    async createConversation(userId, dto) {
        if (dto.type === 'direct') {
            if (!dto.participantId) {
                throw new common_1.BadRequestException('participantId is required for direct conversations');
            }
            const existing = await this.conversationModel.findOne({
                type: 'direct',
                participants: { $all: [new mongoose_2.Types.ObjectId(userId), new mongoose_2.Types.ObjectId(dto.participantId)] },
            });
            if (existing)
                return this.formatConversation(existing);
            const conv = new this.conversationModel({
                type: 'direct',
                participants: [new mongoose_2.Types.ObjectId(userId), new mongoose_2.Types.ObjectId(dto.participantId)],
            });
            await conv.save();
            return this.formatConversation(conv);
        }
        if (!dto.groupID) {
            throw new common_1.BadRequestException('groupID is required for group conversations');
        }
        const member = await this.groupMemberModel.findOne({ memberID: userId, groupID: dto.groupID });
        if (!member)
            throw new common_1.ForbiddenException('You are not a member of this group');
        const existing = await this.conversationModel.findOne({ type: 'group', groupID: dto.groupID });
        if (existing)
            return this.formatConversation(existing);
        const conv = new this.conversationModel({ type: 'group', groupID: dto.groupID });
        await conv.save();
        return this.formatConversation(conv);
    }
    async getConversations(userId, dto) {
        const page = Number(dto.pageNumber);
        const limit = Number(dto.itemNumber);
        const skip = (page - 1) * limit;
        const memberships = await this.groupMemberModel
            .find({ memberID: userId })
            .select('groupID')
            .lean();
        const groupIds = memberships.map(m => m.groupID);
        const query = {
            $or: [
                { type: 'direct', participants: new mongoose_2.Types.ObjectId(userId) },
                { type: 'group', groupID: { $in: groupIds } },
            ],
        };
        const [conversations, total] = await Promise.all([
            this.conversationModel.find(query).sort({ updateDate: -1 }).skip(skip).limit(limit).lean(),
            this.conversationModel.countDocuments(query),
        ]);
        return {
            total,
            pageNumber: page,
            itemNumber: limit,
            totalPages: Math.ceil(total / limit),
            conversations: conversations.map(c => this.formatConversation(c)),
        };
    }
    async getMessages(userId, dto) {
        const conv = await this.conversationModel.findById(dto.conversationID).lean();
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        await this.assertParticipant(userId, conv);
        const filter = { conversationId: new mongoose_2.Types.ObjectId(dto.conversationID) };
        if (dto.beforeMessageID) {
            filter._id = { $lt: new mongoose_2.Types.ObjectId(dto.beforeMessageID) };
        }
        const messages = await this.messageModel
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(dto.limit)
            .lean();
        return { messages, hasMore: messages.length === dto.limit };
    }
    async saveMessage(senderId, dto) {
        const conv = await this.conversationModel.findById(dto.conversationId).lean();
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        await this.assertParticipant(senderId, conv);
        const msg = new this.messageModel({
            conversationId: new mongoose_2.Types.ObjectId(dto.conversationId),
            senderId: new mongoose_2.Types.ObjectId(senderId),
            type: dto.type,
            encryptedForReceiver: dto.encryptedForReceiver,
            encryptedForSender: dto.encryptedForSender,
            nonce: dto.nonce,
            encryptionVersion: dto.encryptionVersion ?? 'nacl-box-v1',
        });
        await msg.save();
        await this.conversationModel.findByIdAndUpdate(dto.conversationId, { lastMessage: msg._id });
        return msg;
    }
    async markRead(userId, messageId) {
        await this.messageModel.findByIdAndUpdate(messageId, { $addToSet: { readBy: new mongoose_2.Types.ObjectId(userId) } });
    }
    async findConversationForUser(userId, conversationId) {
        const conv = await this.conversationModel.findById(conversationId).lean();
        if (!conv)
            return null;
        try {
            await this.assertParticipant(userId, conv);
            return conv;
        }
        catch {
            return null;
        }
    }
    async assertParticipant(userId, conv) {
        if (conv.type === 'direct') {
            const ok = conv.participants.some((p) => String(p) === userId);
            if (!ok)
                throw new common_1.ForbiddenException('You are not a participant in this conversation');
        }
        else {
            const member = await this.groupMemberModel.findOne({
                memberID: userId,
                groupID: conv.groupID,
            });
            if (!member)
                throw new common_1.ForbiddenException('You are not a member of this group');
        }
    }
    formatConversation(c) {
        return {
            conversationId: c._id,
            type: c.type,
            participants: c.participants ?? [],
            groupID: c.groupID ?? null,
            lastMessage: c.lastMessage ?? null,
            createDate: c.createDate,
            updateDate: c.updateDate,
        };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(2, (0, mongoose_1.InjectModel)(group_member_schema_1.GroupMember.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map