import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateExpenseDto {
  @IsString({ message: 'productID is required' })
  productID: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'price must be a valid number' })
  @Min(0, { message: 'price must be greater than or equal to 0' })
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'description must not exceed 500 characters' })
  description?: string;
}
