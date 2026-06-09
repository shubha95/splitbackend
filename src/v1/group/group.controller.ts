import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { GroupService }    from './group.service';
import { JwtAuthGuard }    from '../auth/jwt-auth.guard';
import { CreateGroupDto }  from './dto/create-group.dto';
import { UpdateGroupDto }  from './dto/update-group.dto';
import { GetMyGroupsDto }  from './dto/get-my-groups.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller({ path: 'group', version: '1' })
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @HttpCode(201)
  async createGroup(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateGroupDto,
  ) {
    const data = await this.groupService.createGroup(String(user.id), dto);
    return { message: 'Group created successfully', data };
  }

  @Post('my-groups')
  @HttpCode(200)
  async getMyGroups(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: GetMyGroupsDto,
  ) {
    const data = await this.groupService.getMyGroups(String(user.id), dto);
    return { message: 'Groups fetched successfully', data };
  }

  @Put()
  async updateGroup(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateGroupDto,
  ) {
    if (dto.groupName === undefined && dto.description === undefined) {
      throw new BadRequestException('Provide at least one field to update: groupName or description');
    }
    const data = await this.groupService.updateGroup(String(user.id), dto);
    return { message: 'Group updated successfully', data };
  }

  @Delete()
  async deleteGroup(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { groupID: string },
  ) {
    if (!body?.groupID) {
      throw new BadRequestException('groupID is required in request body');
    }
    const data = await this.groupService.deleteGroup(String(user.id), body.groupID);
    return { message: 'Group deleted successfully', data };
  }
}
