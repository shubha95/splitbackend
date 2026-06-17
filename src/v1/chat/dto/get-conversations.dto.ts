import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetConversationsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  itemNumber: number;
}
