import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetMyGroupsDto {
  @Type(() => Number)
  @IsInt({ message: 'pageNumber must be a positive integer' })
  @Min(1, { message: 'pageNumber must be a positive integer' })
  pageNumber: number;

  @Type(() => Number)
  @IsInt({ message: 'itemNumber must be between 1 and 100' })
  @Min(1, { message: 'itemNumber must be between 1 and 100' })
  @Max(100, { message: 'itemNumber must be between 1 and 100' })
  itemNumber: number;
}
