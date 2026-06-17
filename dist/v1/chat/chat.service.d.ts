import { Model, Types } from 'mongoose';
import { ConversationDocument } from '../../schemas/conversation.schema';
import { Message, MessageDocument } from '../../schemas/message.schema';
import { GroupMemberDocument } from '../../schemas/group-member.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatService {
    private readonly conversationModel;
    private readonly messageModel;
    private readonly groupMemberModel;
    constructor(conversationModel: Model<ConversationDocument>, messageModel: Model<MessageDocument>, groupMemberModel: Model<GroupMemberDocument>);
    createConversation(userId: string, dto: CreateConversationDto): Promise<{
        conversationId: any;
        type: any;
        participants: any;
        groupID: any;
        lastMessage: any;
        createDate: any;
        updateDate: any;
    }>;
    getConversations(userId: string, dto: GetConversationsDto): Promise<{
        total: number;
        pageNumber: number;
        itemNumber: number;
        totalPages: number;
        conversations: {
            conversationId: any;
            type: any;
            participants: any;
            groupID: any;
            lastMessage: any;
            createDate: any;
            updateDate: any;
        }[];
    }>;
    getMessages(userId: string, dto: GetMessagesDto): Promise<{
        messages: (import("mongoose").FlattenMaps<MessageDocument> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        hasMore: boolean;
    }>;
    saveMessage(senderId: string, dto: SendMessageDto): Promise<import("mongoose").Document<unknown, {}, MessageDocument, {}, {}> & Message & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markRead(userId: string, messageId: string): Promise<void>;
    findConversationForUser(userId: string, conversationId: string): Promise<import("mongoose").FlattenMaps<ConversationDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private assertParticipant;
    private formatConversation;
}
