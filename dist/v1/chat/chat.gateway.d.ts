import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { PresenceService } from './presence.service';
import { JoinRoomPayload, SendMessagePayload, TypingPayload, ReadReceiptPayload } from './chat.events';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    private readonly chatService;
    private readonly presenceService;
    server: Server;
    constructor(authService: AuthService, chatService: ChatService, presenceService: PresenceService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinRoom(client: Socket, payload: JoinRoomPayload): Promise<void>;
    handleSendMessage(client: Socket, payload: SendMessagePayload): Promise<void>;
    handleTyping(client: Socket, payload: TypingPayload): void;
    handleReadReceipt(client: Socket, payload: ReadReceiptPayload): Promise<void>;
}
