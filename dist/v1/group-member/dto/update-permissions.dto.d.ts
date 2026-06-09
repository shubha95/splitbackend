import { Permission } from '../../../schemas/group-member.schema';
export declare class UpdatePermissionsDto {
    targetMemberID: string;
    groupID: string;
    permissions: Permission[];
}
