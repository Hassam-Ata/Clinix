import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsIn } from 'class-validator';
import { DoctorSpecialization } from '@prisma/client';

export class DoctorSearchDto {
  @IsOptional()
  @IsEnum(DoctorSpecialization)
  specialization?: DoctorSpecialization;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minFees?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxFees?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsIn(['fees', 'createdAt'])
  sortBy?: 'fees' | 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}