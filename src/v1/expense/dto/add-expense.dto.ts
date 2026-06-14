import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class AddExpenseDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'price must be a valid number' })
  @Min(0, { message: 'price must be greater than or equal to 0' })
  price: number;

  @IsString({ message: 'description is required' })
  @MaxLength(500, { message: 'description must not exceed 500 characters' })
  description: string;

  @IsOptional()
  @IsString()
  groupID?: string;
}
