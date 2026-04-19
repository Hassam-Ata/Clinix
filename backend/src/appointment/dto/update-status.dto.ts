import { IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;
  @IsOptional()
  meetingLink?: string;
}
