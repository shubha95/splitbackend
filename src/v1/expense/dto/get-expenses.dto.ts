import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetExpensesDto {
  @Type(() => Number)
  @IsInt({ message: 'pageNumber must be a positive integer starting from 1' })
  @Min(1, { message: 'pageNumber must be a positive integer starting from 1' })
  pageNumber: number;

  @Type(() => Number)
  @IsInt({ message: 'itemNumber must be a positive integer' })
  @Min(1, { message: 'itemNumber must be a positive integer' })
  @Max(100, { message: 'itemNumber must not exceed 100 per page' })
  itemNumber: number;

  @IsOptional()
  @IsString()
  groupID?: string;
}
