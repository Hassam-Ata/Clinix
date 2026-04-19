import { IsString } from 'class-validator';

export class RejectDoctorDto {
  @IsString()
  reason!: string;
}
