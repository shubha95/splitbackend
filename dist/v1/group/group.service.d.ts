import { Model } from 'mongoose';
import { GroupDocument } from '../../schemas/group.schema';
import { GroupMemberDocument } from '../../schemas/group-member.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetMyGroupsDto } from './dto/get-my-groups.dto';
export declare class GroupService {
    private readonly groupModel;
    private readonly groupMemberModel;
    constructor(groupModel: Model<GroupDocument>, groupMemberModel: Model<GroupMemberDocument>);
    createGroup(userId: string, dto: CreateGroupDto): Promise<{
        groupID: any;
        groupName: any;
        createdBy: any;
        description: any;
        createDate: any;
        updateDate: any;
    }>;
    updateGroup(userId: string, dto: UpdateGroupDto): Promise<{
        groupID: any;
        groupName: any;
        createdBy: any;
        description: any;
        createDate: any;
        updateDate: any;
    }>;
    deleteGroup(userId: string, groupID: string): Promise<{
        groupID: import("mongoose").Types.ObjectId;
    }>;
    getMyGroups(userId: string, dto: GetMyGroupsDto): Promise<{
        total: any;
        pageNumber: number;
        itemNumber: number;
        totalPages: number;
        groups: any;
    }>;
    private format;
}
