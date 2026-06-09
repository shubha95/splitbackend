import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model }       from 'mongoose';

import { GroupMember, GroupMemberDocument } from '../../schemas/group-member.schema';
import { AddMembersDto }        from './dto/add-members.dto';
import { UpdateMemberDto }      from './dto/update-member.dto';
import { DeleteMemberDto }      from './dto/delete-member.dto';
import { PromoteDemoteDto }     from './dto/promote-demote.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectModel(GroupMember.name)
    private readonly groupMemberModel: Model<GroupMemberDocument>,
  ) {}

  async addMembers(requesterId: string, dto: AddMembersDto) {
    const requester = await this.groupMemberModel.findOne({
      memberID: String(requesterId),
      groupID:  String(dto.groupID),
    });

    const canAdd =
      requester &&
      (requester.role === 'owner' ||
        (requester.role === 'admin' && requester.permissions.includes('addMember')));

    if (!canAdd) {
      throw new ForbiddenException(
        'You do not have permission to add members to this group',
      );
    }

    const docs = dto.memberID.map((id) => ({
      memberID:     String(id).trim(),
      groupID:      String(dto.groupID).trim(),
      groupAddedBy: String(requesterId),
      role:         'member',
      permissions:  [],
    }));

    let insertedDocs: any[] = [];
    let skippedCount = 0;

    try {
      insertedDocs = await this.groupMemberModel.insertMany(docs, { ordered: false });
    } catch (err: any) {
      if (err.code === 11000 || err.writeErrors) {
        insertedDocs = err.insertedDocs || [];
        skippedCount = (err.writeErrors || []).length;
      } else {
        throw err;
      }
    }

    return {
      totalRequested: dto.memberID.length,
      added:          insertedDocs.length,
      skipped:        skippedCount,
      members:        insertedDocs.map(this.format),
    };
  }

  async updateMember(requesterId: string, dto: UpdateMemberDto) {
    const member = await this.groupMemberModel.findOne({
      _id:          dto.memberRecordID,
      groupAddedBy: String(requesterId),
    });

    if (!member) {
      throw new NotFoundException(
        'Member record not found or you do not have permission',
      );
    }

    member.groupID = String(dto.groupID).trim();
    await member.save();

    return this.format(member);
  }

  async deleteMember(requesterId: string, dto: DeleteMemberDto) {
    const memberDoc = await this.groupMemberModel.findById(dto.memberRecordID).lean();
    if (!memberDoc) throw new NotFoundException('Member record not found');

    if (memberDoc.role === 'owner') {
      throw new ForbiddenException('The group owner cannot be removed');
    }

    const requester = await this.groupMemberModel.findOne({
      memberID: String(requesterId),
      groupID:  memberDoc.groupID,
    });

    const canRemove =
      requester &&
      (requester.role === 'owner' ||
        (requester.role === 'admin' && requester.permissions.includes('removeMember')));

    if (!canRemove) {
      throw new ForbiddenException(
        'You do not have permission to remove members from this group',
      );
    }

    await this.groupMemberModel.findByIdAndDelete(dto.memberRecordID);
    return { memberRecordID: memberDoc._id };
  }

  async promoteToAdmin(requesterId: string, dto: PromoteDemoteDto) {
    const requester = await this.groupMemberModel.findOne({
      memberID: String(requesterId),
      groupID:  String(dto.groupID),
    });

    if (!requester || requester.role !== 'owner') {
      throw new ForbiddenException(
        'Only the group owner can promote members to admin',
      );
    }

    const member = await this.groupMemberModel.findOneAndUpdate(
      { memberID: String(dto.targetMemberID), groupID: String(dto.groupID), role: 'member' },
      { role: 'admin', permissions: [] },
      { new: true },
    );

    if (!member) {
      throw new NotFoundException('Member not found or is already an admin/owner');
    }

    return this.format(member);
  }

  async demoteToMember(requesterId: string, dto: PromoteDemoteDto) {
    const requester = await this.groupMemberModel.findOne({
      memberID: String(requesterId),
      groupID:  String(dto.groupID),
    });

    if (!requester || requester.role !== 'owner') {
      throw new ForbiddenException('Only the group owner can demote admins');
    }

    const member = await this.groupMemberModel.findOneAndUpdate(
      { memberID: String(dto.targetMemberID), groupID: String(dto.groupID), role: 'admin' },
      { role: 'member', permissions: [] },
      { new: true },
    );

    if (!member) {
      throw new NotFoundException('Member not found or is not an admin');
    }

    return this.format(member);
  }

  async updatePermissions(requesterId: string, dto: UpdatePermissionsDto) {
    const requester = await this.groupMemberModel.findOne({
      memberID: String(requesterId),
      groupID:  String(dto.groupID),
    });

    if (!requester || requester.role !== 'owner') {
      throw new ForbiddenException('Only the group owner can manage permissions');
    }

    const member = await this.groupMemberModel.findOneAndUpdate(
      { memberID: String(dto.targetMemberID), groupID: String(dto.groupID), role: 'admin' },
      { permissions: dto.permissions },
      { new: true },
    );

    if (!member) {
      throw new NotFoundException('Admin member not found in this group');
    }

    return this.format(member);
  }

  private format(member: any) {
    return {
      memberRecordID: member._id,
      memberID:       member.memberID,
      groupID:        member.groupID,
      groupAddedBy:   member.groupAddedBy,
      role:           member.role,
      permissions:    member.permissions,
      createDate:     member.createDate,
    };
  }
}
