import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types }  from 'mongoose';

import { Conversation, ConversationDocument } from '../../schemas/conversation.schema';
import { Message, MessageDocument }           from '../../schemas/message.schema';
import { GroupMember, GroupMemberDocument }   from '../../schemas/group-member.schema';
import { CreateConversationDto }  from './dto/create-conversation.dto';
import { GetConversationsDto }    from './dto/get-conversations.dto';
import { GetMessagesDto }         from './dto/get-messages.dto';
import { SendMessageDto }         from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)      private readonly messageModel:      Model<MessageDocument>,
    @InjectModel(GroupMember.name)  private readonly groupMemberModel:  Model<GroupMemberDocument>,
  ) {}

  // ── conversations ─────────────────────────────────────────────────────────

  async createConversation(userId: string, dto: CreateConversationDto) {
    if (dto.type === 'direct') {
      if (!dto.participantId) {
        throw new BadRequestException('participantId is required for direct conversations');
      }
      const existing = await this.conversationModel.findOne({
        type:         'direct',
        participants: { $all: [new Types.ObjectId(userId), new Types.ObjectId(dto.participantId)] },
      });
      if (existing) return this.formatConversation(existing);

      const conv = new this.conversationModel({
        type:         'direct',
        participants: [new Types.ObjectId(userId), new Types.ObjectId(dto.participantId)],
      });
      await conv.save();
      return this.formatConversation(conv);
    }

    // group
    if (!dto.groupID) {
      throw new BadRequestException('groupID is required for group conversations');
    }
    const member = await this.groupMemberModel.findOne({ memberID: userId, groupID: dto.groupID });
    if (!member) throw new ForbiddenException('You are not a member of this group');

    const existing = await this.conversationModel.findOne({ type: 'group', groupID: dto.groupID });
    if (existing) return this.formatConversation(existing);

    const conv = new this.conversationModel({ type: 'group', groupID: dto.groupID });
    await conv.save();
    return this.formatConversation(conv);
  }

  async getConversations(userId: string, dto: GetConversationsDto) {
    const page  = Number(dto.pageNumber);
    const limit = Number(dto.itemNumber);
    const skip  = (page - 1) * limit;

    const memberships = await this.groupMemberModel
      .find({ memberID: userId })
      .select('groupID')
      .lean();
    const groupIds = memberships.map(m => m.groupID);

    const query = {
      $or: [
        { type: 'direct', participants: new Types.ObjectId(userId) },
        { type: 'group',  groupID: { $in: groupIds } },
      ],
    };

    const [conversations, total] = await Promise.all([
      this.conversationModel.find(query).sort({ updateDate: -1 }).skip(skip).limit(limit).lean(),
      this.conversationModel.countDocuments(query),
    ]);

    return {
      total,
      pageNumber:  page,
      itemNumber:  limit,
      totalPages:  Math.ceil(total / limit),
      conversations: conversations.map(c => this.formatConversation(c)),
    };
  }

  // ── messages ──────────────────────────────────────────────────────────────

  async getMessages(userId: string, dto: GetMessagesDto) {
    const conv = await this.conversationModel.findById(dto.conversationID).lean();
    if (!conv) throw new NotFoundException('Conversation not found');

    await this.assertParticipant(userId, conv);

    const filter: any = { conversationId: new Types.ObjectId(dto.conversationID) };
    if (dto.beforeMessageID) {
      filter._id = { $lt: new Types.ObjectId(dto.beforeMessageID) };
    }

    const messages = await this.messageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(dto.limit)
      .lean();

    return { messages, hasMore: messages.length === dto.limit };
  }

  // Called by both REST (future) and the Socket gateway
  async saveMessage(senderId: string, dto: SendMessageDto) {
    const conv = await this.conversationModel.findById(dto.conversationId).lean();
    if (!conv) throw new NotFoundException('Conversation not found');

    await this.assertParticipant(senderId, conv);

    const msg = new this.messageModel({
      conversationId:       new Types.ObjectId(dto.conversationId),
      senderId:             new Types.ObjectId(senderId),
      type:                 dto.type,
      encryptedForReceiver: dto.encryptedForReceiver,
      encryptedForSender:   dto.encryptedForSender,
      nonce:                dto.nonce,
      encryptionVersion:    dto.encryptionVersion ?? 'nacl-box-v1',
    });
    await msg.save();

    await this.conversationModel.findByIdAndUpdate(dto.conversationId, { lastMessage: msg._id });

    return msg;
  }

  async markRead(userId: string, messageId: string) {
    await this.messageModel.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: new Types.ObjectId(userId) } },
    );
  }

  // Used by gateway to verify join-room access
  async findConversationForUser(userId: string, conversationId: string) {
    const conv = await this.conversationModel.findById(conversationId).lean();
    if (!conv) return null;
    try {
      await this.assertParticipant(userId, conv);
      return conv;
    } catch {
      return null;
    }
  }

  // ── helpers ───────────────────────────────────────────────────────────────

  private async assertParticipant(userId: string, conv: any) {
    if (conv.type === 'direct') {
      const ok = conv.participants.some((p: any) => String(p) === userId);
      if (!ok) throw new ForbiddenException('You are not a participant in this conversation');
    } else {
      const member = await this.groupMemberModel.findOne({
        memberID: userId,
        groupID:  conv.groupID,
      });
      if (!member) throw new ForbiddenException('You are not a member of this group');
    }
  }

  private formatConversation(c: any) {
    return {
      conversationId: c._id,
      type:           c.type,
      participants:   c.participants ?? [],
      groupID:        c.groupID     ?? null,
      lastMessage:    c.lastMessage ?? null,
      createDate:     c.createDate,
      updateDate:     c.updateDate,
    };
  }
}
