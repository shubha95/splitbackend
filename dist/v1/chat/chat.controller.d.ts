import { ChatService } from './chat.service';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createConversation(user: CurrentUserPayload, dto: CreateConversationDto): Promise<{
        message: string;
        data: {
            conversationId: any;
            type: any;
            participants: any;
            groupID: any;
            lastMessage: any;
            createDate: any;
            updateDate: any;
        };
    }>;
    getConversations(user: CurrentUserPayload, dto: GetConversationsDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getMessages(user: CurrentUserPayload, dto: GetMessagesDto): Promise<{
        message: string;
        data: {
            messages: (import("mongoose").FlattenMaps<import("../../schemas/message.schema").MessageDocument> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
            hasMore: boolean;
        };
    }>;
}
