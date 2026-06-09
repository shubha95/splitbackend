import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Group, GroupDocument }             from '../../schemas/group.schema';
import { GroupMember, GroupMemberDocument } from '../../schemas/group-member.schema';
import { CreateGroupDto }  from './dto/create-group.dto';
import { UpdateGroupDto }  from './dto/update-group.dto';
import { GetMyGroupsDto }  from './dto/get-my-groups.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)       private readonly groupModel: Model<GroupDocument>,
    @InjectModel(GroupMember.name) private readonly groupMemberModel: Model<GroupMemberDocument>,
  ) {}

  async createGroup(userId: string, dto: CreateGroupDto) {
    const group = new this.groupModel({
      groupName:   String(dto.groupName).trim(),
      createdBy:   userId,
      description: dto.description ? String(dto.description).trim() : '',
    });
    await group.save();

    // Seed creator as owner in GroupMember
    await this.groupMemberModel.create({
      memberID:     userId,
      groupID:      String(group._id),
      groupAddedBy: userId,
      role:         'owner',
      permissions:  [],
    });

    return this.format(group);
  }

  async updateGroup(userId: string, dto: UpdateGroupDto) {
    const membership = await this.groupMemberModel.findOne({
      memberID: userId,
      groupID:  String(dto.groupID),
    });

    const canEdit =
      membership &&
      (membership.role === 'owner' ||
        (membership.role === 'admin' && membership.permissions.includes('editGroup')));

    if (!canEdit) {
      throw new NotFoundException('Group not found or you do not have permission to edit');
    }

    const group = await this.groupModel.findById(dto.groupID);
    if (!group) throw new NotFoundException('Group not found');

    if (dto.groupName   !== undefined) group.groupName   = String(dto.groupName).trim();
    if (dto.description !== undefined) group.description = String(dto.description).trim();

    await group.save();
    return this.format(group);
  }

  async deleteGroup(userId: string, groupID: string) {
    const membership = await this.groupMemberModel.findOne({
      memberID: userId,
      groupID,
    });

    const canDelete =
      membership &&
      (membership.role === 'owner' ||
        (membership.role === 'admin' && membership.permissions.includes('deleteGroup')));

    if (!canDelete) {
      throw new NotFoundException('Group not found or you do not have permission to delete');
    }

    const memberCount = await this.groupMemberModel.countDocuments({ groupID });
    if (memberCount > 1) {
      throw new BadRequestException(
        'Cannot delete group while it still has members. Remove all members first.',
      );
    }

    const group = await this.groupModel.findByIdAndDelete(groupID);
    if (!group) throw new NotFoundException('Group not found');

    await this.groupMemberModel.deleteMany({ groupID });
    return { groupID: group._id };
  }

  async getMyGroups(userId: string, dto: GetMyGroupsDto) {
    const limit = Number(dto.itemNumber);
    const skip  = (Number(dto.pageNumber) - 1) * limit;

    const [result] = await this.groupMemberModel.aggregate([
      { $match: { memberID: userId } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          members: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from:     'groups',
                let:      { gid: '$groupID' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$gid' }] } } },
                ],
                as: 'groupData',
              },
            },
            { $unwind: '$groupData' },
            { $replaceRoot: { newRoot: '$groupData' } },
          ],
        },
      },
    ]);

    const total = result.total[0]?.count ?? 0;

    return {
      total,
      pageNumber: Number(dto.pageNumber),
      itemNumber: limit,
      totalPages: Math.ceil(total / limit),
      groups:     result.members.map(this.format),
    };
  }

  private format(group: any) {
    return {
      groupID:     group._id,
      groupName:   group.groupName,
      createdBy:   group.createdBy,
      description: group.description,
      createDate:  group.createDate,
      updateDate:  group.updateDate,
    };
  }
}
