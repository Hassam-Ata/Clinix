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
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

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

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId,
        doctorId: doctor.id,
        startTime: start,
        endTime: end,
        status: AppointmentStatus.PENDING,
      },
    });

    // 🔔 NOTIFY DOCTOR
    await this.notificationService.createNotification(
      doctor.userId,
      'New appointment request received',
      'APPOINTMENT_CREATED',
    );

    return appointment;
  }

  async getMyAppointments(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: { include: { user: true } } },
      orderBy: { startTime: 'desc' },
    });
  }

  async getDoctorAppointments(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: { patient: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async updateStatus(
    userId: string,
    appointmentId: string,
    dto: UpdateAppointmentStatusDto,
  ) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Not allowed');
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: dto.status },
    });

    // 🔔 NOTIFY PATIENT
    if (dto.status === AppointmentStatus.ACCEPTED) {
      await this.notificationService.createNotification(
        appointment.patientId,
        'Your appointment was accepted',
        'APPOINTMENT_ACCEPTED',
      );
    }

    if (dto.status === AppointmentStatus.REJECTED) {
      await this.notificationService.createNotification(
        appointment.patientId,
        'Your appointment was rejected',
        'APPOINTMENT_REJECTED',
      );
    }

    return updated;
  }
}
