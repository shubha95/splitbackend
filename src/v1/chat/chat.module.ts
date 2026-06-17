import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatController }  from './chat.controller';
import { ChatService }     from './chat.service';
import { ChatGateway }     from './chat.gateway';
import { PresenceService } from './presence.service';
import { AuthModule }      from '../auth/auth.module';
import { Conversation, ConversationSchema } from '../../schemas/conversation.schema';
import { Message, MessageSchema }           from '../../schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name,      schema: MessageSchema },
    ]),
    AuthModule, // provides JwtAuthGuard, JwtModule, and GroupMember/User models
  ],
  controllers: [ChatController],
  providers:   [ChatService, ChatGateway, PresenceService],
})
export class ChatModule {}
