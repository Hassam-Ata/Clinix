import { IsEnum, IsDateString } from 'class-validator';

export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class CreateAvailabilityDto {
  @IsEnum(WeekDay)
  day!: WeekDay;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;
}
