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
import { CompleteAppointmentDto } from './dto/complete-appointment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2, // ✅ ADDED
  ) {}

  // =========================
  // CREATE APPOINTMENT
  // =========================
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

    // 🔥 EVENT: Appointment Created
    this.eventEmitter.emit('appointment.created', {
      appointmentId: appointment.id,
      doctorId: doctor.id,
      patientId,
    });

    return appointment;
  }

  // =========================
  // UPDATE STATUS (ACCEPT / REJECT)
  // =========================
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
      data: {
        status: dto.status,
        meetingLink: dto.meetingLink ?? appointment.meetingLink,
      },
    });

    // 🔥 EVENTS ONLY (NO DIRECT NOTIFICATIONS)

    if (dto.status === AppointmentStatus.ACCEPTED) {
      this.eventEmitter.emit('appointment.accepted', {
        appointmentId: updated.id,
        patientId: updated.patientId,
        doctorId: updated.doctorId,
        meetingLink: updated.meetingLink,
      });
    }

    if (dto.status === AppointmentStatus.REJECTED) {
      this.eventEmitter.emit('appointment.rejected', {
        appointmentId: updated.id,
        patientId: updated.patientId,
      });
    }

    return updated;
  }

  // =========================
  // COMPLETE APPOINTMENT
  // =========================
  async completeAppointment(
    userId: string,
    appointmentId: string,
    dto: CompleteAppointmentDto,
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

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Not allowed');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Appointment already completed');
    }

    if (appointment.status !== AppointmentStatus.ACCEPTED) {
      throw new BadRequestException(
        'Only ACCEPTED appointments can be completed',
      );
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.COMPLETED,
      },
    });

    // 🔥 EVENT
    this.eventEmitter.emit('appointment.completed', {
      appointmentId: updated.id,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
    });

    return updated;
  }

  // =========================
  // GET METHODS (UNCHANGED)
  // =========================
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

  // =========================
  // CANCEL APPOINTMENT
  // =========================
  async cancelAppointment(userId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.patientId !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    const status = appointment.status;

    if (status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed appointment');
    }

    if (status === AppointmentStatus.REJECTED) {
      throw new BadRequestException('Already rejected');
    }

    if (status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Already cancelled');
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCELLED,
      },
    });

    // 🔥 EVENT
    this.eventEmitter.emit('appointment.cancelled', {
      appointmentId: updated.id,
      patientId: updated.patientId,
    });

    return updated;
  }
}
