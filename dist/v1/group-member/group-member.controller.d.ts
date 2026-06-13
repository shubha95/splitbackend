import { GroupMemberService } from './group-member.service';
import { AddMembersDto } from './dto/add-members.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { DeleteMemberDto } from './dto/delete-member.dto';
import { PromoteDemoteDto } from './dto/promote-demote.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { GetGroupMembersDto } from './dto/get-group-members.dto';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
export declare class GroupMemberController {
    private readonly groupMemberService;
    constructor(groupMemberService: GroupMemberService);
    addMembers(user: CurrentUserPayload, dto: AddMembersDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    updateMember(user: CurrentUserPayload, dto: UpdateMemberDto): Promise<{
        message: string;
        data: {
            memberRecordID: any;
            memberID: any;
            groupID: any;
            groupAddedBy: any;
            role: any;
            permissions: any;
            createDate: any;
        };
    }>;
    deleteMember(user: CurrentUserPayload, dto: DeleteMemberDto): Promise<{
        message: string;
        data: {
            memberRecordID: import("mongoose").Types.ObjectId;
        };
    }>;
    promoteToAdmin(user: CurrentUserPayload, dto: PromoteDemoteDto): Promise<{
        message: string;
        data: {
            memberRecordID: any;
            memberID: any;
            groupID: any;
            groupAddedBy: any;
            role: any;
            permissions: any;
            createDate: any;
        };
    }>;
    demoteToMember(user: CurrentUserPayload, dto: PromoteDemoteDto): Promise<{
        message: string;
        data: {
            memberRecordID: any;
            memberID: any;
            groupID: any;
            groupAddedBy: any;
            role: any;
            permissions: any;
            createDate: any;
        };
    }>;
    updatePermissions(user: CurrentUserPayload, dto: UpdatePermissionsDto): Promise<{
        message: string;
        data: {
            memberRecordID: any;
            memberID: any;
            groupID: any;
            groupAddedBy: any;
            role: any;
            permissions: any;
            createDate: any;
        };
    }>;
    getGroupMembers(user: CurrentUserPayload, dto: GetGroupMembersDto): Promise<{
        message: string;
        data: {
            memberRecordID: import("mongoose").Types.ObjectId;
            memberID: string;
            groupID: string;
            groupAddedBy: string;
            role: string;
            permissions: string[];
            createDate: any;
            userName: string;
            emailId: string;
            avatar: string;
        }[];
    }>;
}
