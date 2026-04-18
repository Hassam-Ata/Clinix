import { IsOptional, IsNumber, IsUrl, IsEnum } from 'class-validator';
import { DoctorSpecialization } from '@prisma/client';

export class UpdateDoctorDto {
  @IsOptional()
  @IsNumber()
  fees?: number;

  @IsOptional()
  @IsUrl()
  documentUrl?: string;

  @IsOptional()
  @IsEnum(DoctorSpecialization)
  specialization?: DoctorSpecialization;
}
