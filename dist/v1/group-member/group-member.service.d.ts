import { Model } from 'mongoose';
import { GroupMemberDocument } from '../../schemas/group-member.schema';
import { AddMembersDto } from './dto/add-members.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { DeleteMemberDto } from './dto/delete-member.dto';
import { PromoteDemoteDto } from './dto/promote-demote.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
export declare class GroupMemberService {
    private readonly groupMemberModel;
    constructor(groupMemberModel: Model<GroupMemberDocument>);
    addMembers(requesterId: string, dto: AddMembersDto): Promise<{
        totalRequested: number;
        added: number;
        skipped: number;
        members: {
            memberRecordID: any;
            memberID: any;
            groupID: any;
            groupAddedBy: any;
            role: any;
            permissions: any;
            createDate: any;
        }[];
    }>;
    updateMember(requesterId: string, dto: UpdateMemberDto): Promise<{
        memberRecordID: any;
        memberID: any;
        groupID: any;
        groupAddedBy: any;
        role: any;
        permissions: any;
        createDate: any;
    }>;
    deleteMember(requesterId: string, dto: DeleteMemberDto): Promise<{
        memberRecordID: import("mongoose").Types.ObjectId;
    }>;
    promoteToAdmin(requesterId: string, dto: PromoteDemoteDto): Promise<{
        memberRecordID: any;
        memberID: any;
        groupID: any;
        groupAddedBy: any;
        role: any;
        permissions: any;
        createDate: any;
    }>;
    demoteToMember(requesterId: string, dto: PromoteDemoteDto): Promise<{
        memberRecordID: any;
        memberID: any;
        groupID: any;
        groupAddedBy: any;
        role: any;
        permissions: any;
        createDate: any;
    }>;
    updatePermissions(requesterId: string, dto: UpdatePermissionsDto): Promise<{
        memberRecordID: any;
        memberID: any;
        groupID: any;
        groupAddedBy: any;
        role: any;
        permissions: any;
        createDate: any;
    }>;
    private format;
}
