import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

import { ChatService }           from './chat.service';
import { JwtAuthGuard }          from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetConversationsDto }   from './dto/get-conversations.dto';
import { GetMessagesDto }        from './dto/get-messages.dto';

@Controller({ path: 'chat', version: '1' })
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @HttpCode(201)
  async createConversation(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateConversationDto,
  ) {
    const data = await this.chatService.createConversation(String(user.id), dto);
    return { message: 'Conversation created successfully', data };
  }

  @Post('conversations/list')
  @HttpCode(200)
  async getConversations(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: GetConversationsDto,
  ) {
    const data = await this.chatService.getConversations(String(user.id), dto);
    return { message: 'Conversations fetched successfully', data };
  }

  @Post('messages')
  @HttpCode(200)
  async getMessages(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: GetMessagesDto,
  ) {
    const data = await this.chatService.getMessages(String(user.id), dto);
    return { message: 'Messages fetched successfully', data };
  }
}
