import { Body, Controller, Delete, HttpCode, Post, Put, UseGuards } from '@nestjs/common';

import { GroupMemberService }   from './group-member.service';
import { JwtAuthGuard }         from '../auth/jwt-auth.guard';
import { AddMembersDto }        from './dto/add-members.dto';
import { UpdateMemberDto }      from './dto/update-member.dto';
import { DeleteMemberDto }      from './dto/delete-member.dto';
import { PromoteDemoteDto }     from './dto/promote-demote.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller({ path: 'group-member', version: '1' })
@UseGuards(JwtAuthGuard)
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post()
  @HttpCode(201)
  async addMembers(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: AddMembersDto,
  ) {
    const data = await this.groupMemberService.addMembers(String(user.id), dto);
    return { message: 'Members added successfully', data };
  }

  @Put()
  async updateMember(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateMemberDto,
  ) {
    const data = await this.groupMemberService.updateMember(String(user.id), dto);
    return { message: 'Member updated successfully', data };
  }

  @Delete()
  async deleteMember(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: DeleteMemberDto,
  ) {
    const data = await this.groupMemberService.deleteMember(String(user.id), dto);
    return { message: 'Member removed successfully', data };
  }

  @Put('promote')
  async promoteToAdmin(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: PromoteDemoteDto,
  ) {
    const data = await this.groupMemberService.promoteToAdmin(String(user.id), dto);
    return { message: 'Member promoted to admin successfully', data };
  }

  @Put('demote')
  async demoteToMember(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: PromoteDemoteDto,
  ) {
    const data = await this.groupMemberService.demoteToMember(String(user.id), dto);
    return { message: 'Admin demoted to member successfully', data };
  }

  @Put('permissions')
  async updatePermissions(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdatePermissionsDto,
  ) {
    const data = await this.groupMemberService.updatePermissions(String(user.id), dto);
    return { message: 'Permissions updated successfully', data };
  }
}
