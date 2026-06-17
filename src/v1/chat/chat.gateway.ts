import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthService }   from '../auth/auth.service';
import { ChatService }   from './chat.service';
import { PresenceService } from './presence.service';
import {
  ChatEvent,
  JoinRoomPayload,
  SendMessagePayload,
  TypingPayload,
  ReadReceiptPayload,
} from './chat.events';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService:   AuthService,
    private readonly chatService:   ChatService,
    private readonly presenceService: PresenceService,
  ) {}

  // ── connection lifecycle ───────────────────────────────────────────────────

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) throw new Error('No token');

      // Shared session-array verification — identical logic to JwtAuthGuard
      const user = await this.authService.verifyToken(token);
      client.data.user = user;

      const justCameOnline = this.presenceService.add(user.id, client.id);
      if (justCameOnline) {
        this.server.emit(ChatEvent.PRESENCE, { userId: user.id, status: 'online' });
      }
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (!user) return;

    const justWentOffline = this.presenceService.remove(user.id, client.id);
    if (justWentOffline) {
      this.server.emit(ChatEvent.PRESENCE, { userId: user.id, status: 'offline' });
    }
  }

  // ── join-room ──────────────────────────────────────────────────────────────

  @SubscribeMessage(ChatEvent.JOIN_ROOM)
  async handleJoinRoom(client: Socket, payload: JoinRoomPayload) {
    const user = client.data?.user;
    if (!user) { client.disconnect(); return; }

    const conv = await this.chatService.findConversationForUser(user.id, payload.conversationId);
    if (!conv) {
      client.emit('error', { message: 'Conversation not found or access denied' });
      return;
    }
    await client.join(payload.conversationId);
  }

  // ── send-message ───────────────────────────────────────────────────────────

  @SubscribeMessage(ChatEvent.SEND_MESSAGE)
  async handleSendMessage(client: Socket, payload: SendMessagePayload) {
    const user = client.data?.user;
    if (!user) { client.disconnect(); return; }

    try {
      const message = await this.chatService.saveMessage(user.id, {
        conversationId:       payload.conversationId,
        type:                 payload.type,
        encryptedForReceiver: payload.encryptedForReceiver,
        encryptedForSender:   payload.encryptedForSender,
        nonce:                payload.nonce,
        encryptionVersion:    payload.encryptionVersion,
      });
      // Broadcast ciphertext to all room members (including sender for multi-device)
      this.server.to(payload.conversationId).emit(ChatEvent.NEW_MESSAGE, message);
    } catch (err: any) {
      client.emit('error', { message: err.message ?? 'Failed to send message' });
    }
  }

  // ── typing ─────────────────────────────────────────────────────────────────

  @SubscribeMessage(ChatEvent.TYPING)
  handleTyping(client: Socket, payload: TypingPayload) {
    const user = client.data?.user;
    if (!user) return;
    // Broadcast to room, exclude sender
    client.to(payload.conversationId).emit(ChatEvent.USER_TYPING, {
      conversationId: payload.conversationId,
      userId:         user.id,
    });
  }

  // ── read-receipt ───────────────────────────────────────────────────────────

  @SubscribeMessage(ChatEvent.READ_RECEIPT)
  async handleReadReceipt(client: Socket, payload: ReadReceiptPayload) {
    const user = client.data?.user;
    if (!user) return;

    await this.chatService.markRead(user.id, payload.messageId);
    this.server.to(payload.conversationId).emit(ChatEvent.MESSAGE_READ, {
      messageId: payload.messageId,
      userId:    user.id,
    });
  }
}
