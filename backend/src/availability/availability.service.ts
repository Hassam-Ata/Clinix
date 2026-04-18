import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  // ✅ Add availability
  async addAvailability(userId: string, dto: CreateAvailabilityDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('Invalid time range');
    }

    // ❗ Prevent overlapping slots (same doctor + same day)
    const conflict = await this.prisma.availability.findFirst({
      where: {
        doctorId: doctor.id,
        day: dto.day,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflict) {
      throw new BadRequestException('Time slot overlaps with existing one');
    }

    return this.prisma.availability.create({
      data: {
        doctorId: doctor.id,
        day: dto.day,
        startTime: start,
        endTime: end,
      },
    });
  }

  // ✅ Get my availability
  async getMyAvailability(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.availability.findMany({
      where: { doctorId: doctor.id },
      orderBy: { startTime: 'asc' },
    });
  }

  // ✅ Get availability by doctorId (public)
  async getDoctorAvailability(doctorId: string) {
    return this.prisma.availability.findMany({
      where: { doctorId },
      orderBy: { startTime: 'asc' },
    });
  }

  // ✅ Delete availability
  async deleteAvailability(userId: string, availabilityId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const availability = await this.prisma.availability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || availability.doctorId !== doctor.id) {
      throw new NotFoundException('Availability not found');
    }

    return this.prisma.availability.delete({
      where: { id: availabilityId },
    });
  }
}
