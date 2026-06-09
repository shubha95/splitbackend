import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetMyGroupsDto } from './dto/get-my-groups.dto';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
    createGroup(user: CurrentUserPayload, dto: CreateGroupDto): Promise<{
        message: string;
        data: {
            groupID: any;
            groupName: any;
            createdBy: any;
            description: any;
            createDate: any;
            updateDate: any;
        };
    }>;
    getMyGroups(user: CurrentUserPayload, dto: GetMyGroupsDto): Promise<{
        message: string;
        data: {
            total: any;
            pageNumber: number;
            itemNumber: number;
            totalPages: number;
            groups: any;
        };
    }>;
    updateGroup(user: CurrentUserPayload, dto: UpdateGroupDto): Promise<{
        message: string;
        data: {
            groupID: any;
            groupName: any;
            createdBy: any;
            description: any;
            createDate: any;
            updateDate: any;
        };
    }>;
    deleteGroup(user: CurrentUserPayload, body: {
        groupID: string;
    }): Promise<{
        message: string;
        data: {
            groupID: import("mongoose").Types.ObjectId;
        };
    }>;
}
