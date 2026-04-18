import { IsEnum, IsNumber, IsString, IsUrl } from 'class-validator';
import { DoctorSpecialization } from '@prisma/client';

export class CreateDoctorDto {
  @IsEnum(DoctorSpecialization)
  specialization!: DoctorSpecialization;

  @IsNumber()
  fees!: number;

  @IsUrl()
  documentUrl!: string;
}
