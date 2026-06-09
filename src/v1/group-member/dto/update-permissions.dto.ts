import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { PERMISSIONS, Permission } from '../../../schemas/group-member.schema';

export class UpdatePermissionsDto {
  @IsString({ message: 'targetMemberID is required' })
  @IsNotEmpty({ message: 'targetMemberID is required' })
  targetMemberID: string;

  @IsString({ message: 'groupID is required' })
  @IsNotEmpty({ message: 'groupID is required' })
  groupID: string;

  @IsArray({ message: 'permissions must be an array' })
  @IsIn(PERMISSIONS, {
    each: true,
    message: `Each permission must be one of: ${PERMISSIONS.join(', ')}`,
  })
  permissions: Permission[];
}
