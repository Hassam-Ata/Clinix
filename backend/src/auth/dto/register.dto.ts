import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { DoctorSpecialization } from '@prisma/client';

export enum Role {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!: Role;

  // Doctor-specific fields (optional for patients)
  @IsOptional()
  @IsEnum(DoctorSpecialization)
  specialization?: DoctorSpecialization;

  @IsOptional()
  @IsNumber()
  fees?: number;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  document?: string;
}
