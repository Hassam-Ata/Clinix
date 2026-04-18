import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(patientId: string, dto: CreateAppointmentDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('Invalid time range');
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.status !== 'APPROVED') {
      throw new ForbiddenException('Doctor not approved');
    }

    const availability = await this.prisma.availability.findFirst({
      where: {
        doctorId: doctor.id,
        startTime: { lte: start },
        endTime: { gte: end },
      },
    });

    if (!availability) {
      throw new BadRequestException('Doctor not available at this time');
    }

    // 3. Prevent overlapping appointments
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('Time slot already booked');
    }

    // 4. Create appointment
    return this.prisma.appointment.create({
      data: {
        patientId,
        doctorId: doctor.id,
        startTime: start,
        endTime: end,
        status: AppointmentStatus.PENDING,
      },
    });
  }

  // 👤 Patient appointments
  async getMyAppointments(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: { include: { user: true } } },
      orderBy: { startTime: 'desc' },
    });
  }

  // 🧑‍⚕️ Doctor appointments
  async getDoctorAppointments(userId: string) {
    // 1. Map USER → DOCTOR
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    // 2. Fetch appointments using DOCTOR ID (NOT USER ID)
    return this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }
  // 🧑‍⚕️ Update status (DOCTOR ONLY)
  async updateStatus(
    userId: string,
    appointmentId: string,
    dto: UpdateAppointmentStatusDto,
  ) {
    // 1. Get doctor from userId
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // 2. Get appointment
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    // 3. FIX CHECK (THIS is what matters)
    if (!appointment || appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Not allowed');
    }

    // 4. Update
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: dto.status },
    });
  }
}
